import importlib.util,pathlib,unittest
p=pathlib.Path(__file__).with_name('translate-english.py');spec=importlib.util.spec_from_file_location('translation',p);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Safety(unittest.TestCase):
 def test_retry_source_is_not_polluted(self):
  source='资产换入；条件未核实'
  messages=m.translation_messages(source,'numbers changed')
  self.assertEqual(messages[1],{'role':'user','content':source})
  self.assertIn('numbers changed',messages[0]['content'])
 def test_diagnostic_leakage_rejected(self):
  with self.assertRaises(ValueError):m.reject_diagnostic_leakage('Translation. Validation error to correct: bad')
  with self.assertRaises(ValueError):m.reject_diagnostic_leakage('Translation. 验证错误')

 def test_tags_urls_code(self):
  source='成本 <strong>10.43U</strong>，<a href="https://example.com/a?q=1&b=2">来源</a> <code>0xabcdef</code>'
  text,tags=m.protect(source)
  out='Cost __TAG0__10.43U__TAG1__, __TAG2__source__TAG3__ __TAG4__'
  self.assertEqual(m.validate(text,out,tags),'Cost <strong>10.43U</strong>, <a href="https://example.com/a?q=1&b=2">source</a> <code>0xabcdef</code>')
 def test_protected_dates(self):
  text,tags=m.protect('10月1日公布，10月11日截止')
  self.assertEqual(m.validate(text,'Announced __TAG0__; deadline __TAG1__',tags),'Announced 10/1; deadline 10/11')
 def test_signal_labels(self):
  self.assertEqual(m.translate('中')[0],'Medium')
  self.assertEqual(m.translate('弱')[0],'Weak')
 def test_financial_context_is_visible(self):
  text,tags=m.protect('每小时预览再降45.75%，6.08U减完整额外费用')
  self.assertEqual(text,'每小时预览再降45.75%，6.08U减完整额外费用')
  self.assertEqual(tags,[])
 def test_dates_may_move_without_changing_structure(self):
  text,tags=m.protect('9月14日签署，以10月5日生效')
  self.assertEqual(m.validate(text,'Effective __TAG1__, signed __TAG0__',tags),'Effective 10/5, signed 9/14')
 def test_percent_cannot_disappear(self):
  with self.assertRaises(ValueError):m.validate('收益5%','yield 5',[])
 def test_rejects_empty_translation(self):
  with self.assertRaises(ValueError):m.validate('研究','',[])
 def test_rejects_loss_omission(self):
  with self.assertRaises(ValueError):m.validate('约亏__TAG0__','approximately __TAG0__',['10.43U'])
 def test_rejects_bad_number(self):
  with self.assertRaises(ValueError):m.validate('损失10.43U','Loss 10.34U',[])
 def test_rejects_ticker_changes(self):
  with self.assertRaises(ValueError):m.validate('已有USDT0','Already holding USDT',[])
 def test_rejects_markup(self):
  with self.assertRaises(ValueError):m.validate('中文','<script>bad()</script>',[])
 def test_rejects_chinese(self):
  with self.assertRaises(ValueError):m.validate('中文','中文',[])
 def test_rejects_marker_reorder(self):
  with self.assertRaises(ValueError):m.validate('__TAG0__中文__TAG1__','__TAG1__text__TAG0__',['<b>','</b>'])
if __name__=='__main__':unittest.main()
