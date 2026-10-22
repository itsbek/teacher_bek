/* Kids band 6-10 from docs/phase-1/copy/mistake-library.md (MIS.K09 reorder omitted: engine has strike/replace/caret only). */
export const MISTAKES = [
 {
  "id": "MIS.K01",
  "spec": "I {very>really} like English.",
  "vi": "Mình nói \"rất thích\" nên bé xếp \"very\" trước \"like\". Tiếng Anh nói \"really like\" hoặc \"like … very much\".",
  "chk": [
   "I very like English.",
   "I really like English."
  ]
 },
 {
  "id": "MIS.K02",
  "spec": "She {have>has} a cat.",
  "vi": "Với he/she/it, \"have\" đổi thành \"has\". Tiếng Việt không chia động từ nên bé hay quên.",
  "chk": [
   "She have a cat.",
   "She has a cat."
  ]
 },
 {
  "id": "MIS.K03",
  "spec": "I am 8 year{^s} old.",
  "vi": "Tiếng Việt không có số nhiều nên bé hay bỏ chữ \"s\": 8 years old.",
  "chk": [
   "I am 8 year old.",
   "I am 8 years old."
  ]
 },
 {
  "id": "MIS.K04",
  "spec": "He go{^es} to school.",
  "vi": "Sau he/she/it, động từ thêm -s/-es (goes, watches). Tiếng Việt không có quy tắc này.",
  "chk": [
   "He go to school.",
   "He goes to school."
  ]
 },
 {
  "id": "MIS.K05",
  "spec": "I {no>don't} like milk.",
  "vi": "Câu phủ định cần \"don't\" trước động từ. Bé dịch \"không thích\" thành \"no like\".",
  "chk": [
   "I no like milk.",
   "I don't like milk."
  ]
 },
 {
  "id": "MIS.K06",
  "spec": "My name {^is} Lan.",
  "vi": "Tiếng Việt nói \"Tên tôi Lan\" là đủ; tiếng Anh cần thêm động từ \"is\".",
  "chk": [
   "My name Lan.",
   "My name is Lan."
  ]
 },
 {
  "id": "MIS.K07",
  "spec": "Where {^do} you live?",
  "vi": "Câu hỏi tiếng Anh cần \"do\" ở đầu. Tiếng Việt chỉ cần \"…ở đâu?\".",
  "chk": [
   "Where you live?",
   "Where do you live?"
  ]
 },
 {
  "id": "MIS.K08",
  "spec": "I go to school {by>on} foot.",
  "vi": "Bé dịch sát \"bằng chân\". Cụm đúng là \"on foot\" (hoặc đơn giản: I walk to school).",
  "chk": [
   "I go to school by foot.",
   "I go to school on foot."
  ]
 },
 {
  "id": "MIS.K10",
  "spec": "I {am>} play football.",
  "vi": "\"am/is/are\" không đi cùng động từ thường. Nói \"I play\" (hoặc \"I am playing\").",
  "chk": [
   "I am play football.",
   "I play football."
  ]
 }
];
