// Adapted from the official Candle 0.9.1 quantized-t5 example (MIT OR Apache-2.0).
// CPU only; local verified files only; one complete source per item; no chat instructions.
use anyhow::{Context, Result};
use candle_core::{Device, Tensor};
use candle_transformers::{generation::LogitsProcessor, models::quantized_t5 as t5};
use serde_json::{json, Value};
use std::{env, fs, io::Write, time::Instant};
use tokenizers::Tokenizer;

fn main() -> Result<()> {
    let args: Vec<String> = env::args().collect();
    anyhow::ensure!(args.len() == 3, "usage: probe MODEL_DIR INPUT_JSON");
    let dir = std::path::Path::new(&args[1]);
    let config: t5::Config = serde_json::from_str(&fs::read_to_string(dir.join("config.json"))?)?;
    let mut tokenizer = Tokenizer::from_file(dir.join("tokenizer.json")).map_err(anyhow::Error::msg)?;
    tokenizer.with_padding(None).with_truncation(None).map_err(anyhow::Error::msg)?;
    let inputs: Vec<Value> = serde_json::from_str(&fs::read_to_string(&args[2])?)?;
    anyhow::ensure!(inputs.len() <= 5, "bounded experiment: at most 5 source paragraphs");
    let device = Device::Cpu;
    let load = Instant::now();
    let vb = t5::VarBuilder::from_gguf(dir.join("model-q4k.gguf"), &device)?;
    let mut model = t5::T5ForConditionalGeneration::load(vb, &config)?;
    eprintln!("Loaded pinned quantized T5 CPU model in {:.2}s", load.elapsed().as_secs_f64());
    for item in inputs {
        let source = item["source_text"].as_str().context("missing source text")?;
        let prompt = format!("<2en> {source}");
        let ids = tokenizer.encode(prompt.clone(), true).map_err(anyhow::Error::msg)?.get_ids().to_vec();
        // Conservative model-config limit; never silently truncate conditions.
        if ids.len() > 512 {
            println!("{}", json!({"input":item,"prompt":prompt,"input_ids":ids,"error":"overlength: input exceeds 512 tokens; source not truncated"}));
            std::io::stdout().flush()?;
            continue;
        }
        model.clear_kv_cache();
        let started = Instant::now();
        let encoder = model.encode(&Tensor::new(ids.as_slice(), &device)?.unsqueeze(0)?)?;
        let encoder_seconds = started.elapsed().as_secs_f64();
        let start_id = config.decoder_start_token_id.unwrap_or(config.pad_token_id) as u32;
        let mut output_ids = vec![start_id];
        // Greedy translation, no repetition penalty modifying token probabilities.
        let mut logits = LogitsProcessor::new(42, None, None);
        let mut ended = false;
        for index in 0..512 {
            let next_input = if index == 0 || !config.use_cache { output_ids.clone() } else { vec![*output_ids.last().unwrap()] };
            let scores = model.decode(&Tensor::new(next_input.as_slice(), &device)?.unsqueeze(0)?, &encoder)?.squeeze(0)?;
            let next = logits.sample(&scores)?;
            output_ids.push(next);
            if next as usize == config.eos_token_id { ended = true; break; }
        }
        // Bare tokenizer.json does not register IDs 0/1/2 as special tokens. Keep raw decoding,
        // remove only the known terminal EOS by ID from display text, never string-strip content.
        let raw_output = tokenizer.decode(&output_ids[1..], false).map_err(anyhow::Error::msg)?;
        let display_end = if ended { output_ids.len()-1 } else { output_ids.len() };
        let output = tokenizer.decode(&output_ids[1..display_end], false).map_err(anyhow::Error::msg)?;
        let seconds = started.elapsed().as_secs_f64();
        println!("{}", json!({"input":item,"prompt":prompt,"input_ids":ids,"output_ids":output_ids,"output":output,"raw_output":raw_output,"eos_reached":ended,"truncated":!ended,"encoder_seconds":encoder_seconds,"seconds":seconds,"decode_tokens_per_second":(output_ids.len()-1) as f64/(seconds-encoder_seconds)}));
        std::io::stdout().flush()?;
    }
    Ok(())
}
