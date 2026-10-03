// Faithful scalar form of transformers v4.23.1 T5Attention._relative_position_bucket.
// relative position is key - query. Decoder identity must not depend on cache mode.
fn t5_relative_bucket(query: u32, key: u32, is_decoder: bool, buckets: u32, max_distance: u32) -> u32 {
    let (distance, effective, offset) = if is_decoder {
        (query.saturating_sub(key), buckets, 0)
    } else {
        (query.abs_diff(key), buckets / 2, if key > query { buckets / 2 } else { 0 })
    };
    let exact = effective / 2;
    let bucket = if distance < exact {
        distance
    } else {
        let logarithmic = ((distance as f64 / exact as f64).ln()
            / (max_distance as f64 / exact as f64).ln()
            * (effective - exact) as f64) as u32;
        (exact + logarithmic).min(effective - 1)
    };
    offset + bucket
}

fn t5_relative_buckets(q_len: u32, kv_len: u32, is_decoder: bool, use_cache: bool, buckets: u32, max_distance: u32) -> Vec<Vec<u32>> {
    let q_start = if use_cache { kv_len - q_len } else { 0 };
    (q_start..q_start + q_len).map(|query| (0..kv_len)
        .map(|key| t5_relative_bucket(query,key,is_decoder,buckets,max_distance))
        .collect()).collect()
}

#[cfg(test)]
mod x_feed_bucket_tests {
    use super::{t5_relative_bucket,t5_relative_buckets};
    #[test]
    fn official_reference_vectors() {
        // Generated separately from the official reference, including all 512 x 512 pairs.
        for line in include_str!("t5-relative-bucket-vectors.csv").lines() {
            let values: Vec<u32> = line.split(',').map(|v| v.parse().unwrap()).collect();
            let actual=t5_relative_bucket(values[1],values[2],values[0] == 1,32,128);
            assert_eq!(actual,values[3],"decoder={}, query={}, key={}",values[0],values[1],values[2]);
        }
    }
    #[test]
    fn cached_and_full_prefix_rows_match() {
        for length in [1_u32,9,16,17,128,129,512] {
            let full=t5_relative_buckets(length,length,true,false,32,128);
            let cached=t5_relative_buckets(1,length,true,true,32,128);
            assert_eq!(full[(length-1) as usize],cached[0]);
            assert!(cached[0].iter().all(|b| *b<32));
            let encoder=t5_relative_buckets(length,length,false,false,32,128);
            if length>9 { assert_ne!(encoder[9][0],full[9][0]); }

        }
        // Decoder classification is explicit even when no KV cache is used.
        assert_eq!(t5_relative_bucket(9,0,true,32,128),9);
        assert_eq!(t5_relative_bucket(9,0,false,32,128),8);
    }
}
