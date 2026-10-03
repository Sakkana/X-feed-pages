import importlib.util,pathlib,unittest
p=pathlib.Path(__file__).with_name('translate-english.py');spec=importlib.util.spec_from_file_location('translation',p);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Safety(unittest.TestCase):
 def test_tags_urls_code(self):
  source='成本 <strong>10.43U</strong>，<a href="https://example.com/a?q=1&b=2">来源</a> <code>0xabcdef</code>'
  text,tags=m.protect(source)
  out='Cost __TAG0____TAG1____TAG2__, __TAG3__source__TAG4__ __TAG5__'
  self.assertEqual(m.validate(text,out,tags),'Cost <strong>10.43U</strong>, <a href="https://example.com/a?q=1&b=2">source</a> <code>0xabcdef</code>')
 def test_protected_dates(self):
  text,tags=m.protect('10月1日公布，10月11日截止')
  self.assertEqual(m.validate(text,'Announced __TAG0__/__TAG1__; deadline __TAG2__/__TAG3__',tags),'Announced 10/1; deadline 10/11')
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
