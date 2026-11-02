'use strict';
(function () {
  // ======== Tillar ========
  const TOPICS = {
    signs: { uz: "Yo'l belgilari", ru: 'Дорожные знаки', en: 'Road signs' },
    markings: { uz: "Yo'l chiziqlari", ru: 'Дорожная разметка', en: 'Road markings' },
    priority: { uz: "Yo'l berish", ru: 'Преимущество проезда', en: 'Right of way' },
    signals: { uz: 'Svetofor va signallar', ru: 'Светофоры и сигналы', en: 'Traffic signals' },
    overtaking: { uz: "Quvib o'tish", ru: 'Обгон', en: 'Overtaking' },
    stopping: { uz: "To'xtash va to'xtab turish", ru: 'Остановка и стоянка', en: 'Stopping and parking' },
    safety: { uz: 'Xavfsizlik', ru: 'Безопасность', en: 'Safety' },
    pedestrians: { uz: 'Piyodalar', ru: 'Пешеходы', en: 'Pedestrians' },
    firstaid: { uz: 'Birinchi yordam', ru: 'Первая помощь', en: 'First aid' },
    vehicle: { uz: 'Texnik holat', ru: 'Техническое состояние', en: 'Vehicle condition' },
  };
  const S = {
    uz: {
      app: 'Avto maktab', bootHelp: "Internet aloqasini va config.js dagi Firebase sozlamasini tekshiring, so'ng sahifani yangilang.", demoBanner: "DEMO rejimi: ma'lumotlar faqat shu brauzerda saqlanadi. Haqiqiy ishlatish uchun Firebase ulang.", setupTitle: "Birinchi o'qituvchi (rahbar) hisobini yarating", setupNote: "Bu faqat bir marta. Login va parolni yozib qo'ying: shu bilan o'qituvchi sifatida kirasiz.", gitTitle: "Savollarni GitHub orqali yangilash", gitHelp: "Savollar sayt bilan birga turgan questions.json faylida. GitHub'da shu faylni tahrirlab (qalam belgisi) saqlasangiz, bir necha daqiqadan keyin yangi savollar hamma uchun paydo bo'ladi.", gitDelay: "GitHub Pages yangilanishi 1-5 daqiqa olishi mumkin. Sahifani yangilab ko'ring.", login: 'Kirish', loginName: 'Login', password: 'Parol', logout: 'Chiqish', teacher: "O'qituvchi", student: "O'quvchi",
      nav_groups: 'Guruhlar', nav_attendance: 'Davomat', nav_grades: 'Baholar', nav_analytics: 'Tahlil', nav_payments: "To'lovlar", nav_questions: 'Savollar bazasi', nav_samples: 'Namuna savollar', nav_settings: 'Sozlamalar',
      nav_home: 'Bosh sahifa', nav_topic: 'Mavzu testi', nav_exam: 'Imtihon',
      group: 'Guruh', groupName: 'Guruh nomi', price: "Kurs narxi (so'm)", students: "O'quvchilar", add: "Qo'shish", save: 'Saqlash', delete: "O'chirish", cancel: 'Bekor qilish', copy: 'Nusxa olish', copied: 'Nusxa olindi',
      newGroup: 'Yangi guruh', noGroups: 'Hali guruh yo\'q. Avval guruh yarating.', pickGroup: 'Guruhni tanlang', name: 'Ism familiya', phone: 'Telefon', newStudent: "Yangi o'quvchi", noStudents: "Bu guruhda o'quvchi yo'q.",
      credTitle: "O'quvchiga shu login va parolni bering", credNote: 'Parol faqat hozir ko\'rinadi. Yo\'qotilsa, "Yangi parol" tugmasini bosing.', resetPw: 'Yangi parol', confirmDel: "Rostdan o'chirilsinmi?", yes: 'Ha', no: "Yo'q",
      date: 'Sana', present: 'Keldi', late: 'Kechikdi', absent: 'Kelmadi', excused: 'Sababli', attendanceSaved: 'Davomat saqlandi', attendancePct: 'Davomat %', visits: 'Darslar',
      kind: 'Tur', theory: 'Nazariya', practice: 'Amaliyot', exam: 'Imtihon', score: 'Baho (1-5)', note: 'Izoh', gradeSaved: 'Baho qo\'yildi', noGrades: "Hali baho yo'q.", chooseStudent: "O'quvchini tanlang", avg: "O'rtacha",
      topic: 'Mavzu', accuracy: "To'g'ri javoblar", answersN: 'javob', questionsWord: 'savol', weakTopics: 'Chala mavzular', weakStudents: "chala o'quvchi", groupWeak: 'Guruh bo\'yicha mavzular (eng zaifi birinchi)', matrix: "O'quvchi × mavzu", noData: "Hali test natijalari yo'q.", weakHint: 'Chala deb 3 tadan ko\'p javobda 70% dan past natija hisoblanadi.',
      studentDetail: "O'quvchi tahlili", attempts: "So'nggi urinishlar", back: 'Orqaga', result: 'Natija',
      paid: "To'langan", debt: 'Qarz', total: 'Jami', amount: "Summa (so'm)", addPayment: "To'lov qo'shish", history: 'Tarix', paymentSaved: "To'lov saqlandi", fullyPaid: "To'liq to'langan", som: "so'm", coursePrice: 'Kurs narxi',
      questionsCount: 'Savollar soni', importTitle: "Savollarni yuklash (JSON)", importHelp: "Savollar JSON ro'yxati ko'rinishida bo'ladi. Namuna formati qo'llanmada (README) bor.", importBtn: 'Yuklash', file: 'Fayldan', imported: "Yuklandi: {a} yangi, {u} yangilandi, {f} xato",
      feedTitle: "Internetdan yangilash", feedHelp: "Savollar JSON fayli joylashgan https:// havolani kiriting. Ilova uni kuniga bir marta o'zi tekshirib, yangi savollarni qo'shadi.", feedUrl: 'Havola (https://...)', feedNow: 'Hozir yangilash', feedLast: "So'nggi yangilanish", feedRemove: "Havolani o'chirish",
      samplesIntro: "To'g'ri javoblar yashil rangda ko'rsatilgan.", all: 'Hammasi',
      start: 'Boshlash', next: 'Keyingi', prev: 'Oldingi', finish: 'Yakunlash', finishConfirm: 'Javob berilmagan savollar xato hisoblanadi. Yakunlansinmi?', question: 'Savol', of: '/', timeLeft: 'Qolgan vaqt',
      passed: "Imtihondan o'tdingiz", failed: "Imtihondan o'tmadingiz", lateNote: 'Vaqt tugagandan keyin topshirildi.', correct: "To'g'ri", errors: 'Xato', review: "Javoblarni ko'rish", yourAnswer: 'Sizning javobingiz', noAnswer: 'javob berilmagan',
      topicTestIntro: "Mavzuni tanlang va 10 ta savolga javob bering. Natija zaif mavzularni aniqlaydi.", examIntro: "Haqiqiy imtihon tartibi: savollar barcha mavzulardan aralash, vaqt cheklangan.", examRules: '{n} ta savol, {m} daqiqa, ko\'pi bilan {e} ta xato mumkin.', practiceWeak: 'Mashq qilish',
      myGrades: 'Baholarim', myAttendance: 'Davomatim', lastAttempts: "So'nggi urinishlar", mode_topic: 'Mavzu testi', mode_exam: 'Imtihon', noWeak: "Hozircha chala mavzu yo'q. Testlarni davom ettiring.",
      oldPw: 'Eski parol', newPw: 'Yangi parol (kamida 6 belgi)', changePw: "Parolni o'zgartirish", pwChanged: "Parol o'zgartirildi", mustChange: "Xavfsizlik uchun avval parolni o'zgartiring.",
      register: "Ro'yxatdan o'tish", regSchool: "Yangi o'quv markazni ro'yxatdan o'tkazish", regJoin: "Mavjud o'quv markazga qo'shilish", region: 'Viloyat', district: 'Tuman', pickRegion: 'Viloyatni tanlang', pickDistrict: 'Tumanni tanlang', school: "O'quv markaz", schoolName: "O'quv markaz nomi", pickSchool: "O'quv markazni tanlang", noSchools: "Bu tumanda hali o'quv markaz ro'yxatdan o'tmagan. Markaz rahbari avval «Yangi o'quv markazni ro'yxatdan o'tkazish» orqali o'z markazini qo'shishi kerak.", firstName: 'Ism', lastName: 'Familiya', roleQ: "Siz kim bo'lib ishlaysiz?", regDone: "Ro'yxatdan o'tdingiz", regDoneNote: "Login va parolni yozib qo'ying: parol faqat hozir ko'rinadi. Markaz rahbari tasdiqlagach shu login va parol bilan kira olasiz.", toLogin: "Kirishga o'tish", haveAccount: 'Hisobingiz bormi? Kirish', noAccount: "Hisobingiz yo'qmi?", regTeacherNote: "O'qituvchi sifatida qo'shilishni faqat markaz rahbari tasdiqlaydi. Parolni yo'qotsangiz, tiklab bo'lmaydi.", regOwnerNote: "Siz markaz rahbari (birinchi o'qituvchi) bo'lasiz. Keyin o'qituvchi va o'quvchilarni tasdiqlaysiz.", pendingTitle: 'Tasdiqlash kutilmoqda', pendingNote: "Hisobingizni o'quv markaz rahbari tasdiqlagach ilovadan foydalana olasiz. Keyinroq qayta kiring yoki «Tekshirish» tugmasini bosing.", check: 'Tekshirish', stillPending: 'Hali tasdiqlanmagan', nav_requests: "So'rovlar", requestsTitle: "Ro'yxatdan o'tish so'rovlari", noRequests: "Yangi so'rov yo'q.", approve: 'Tasdiqlash', reject: 'Rad etish', approved: 'Tasdiqlandi', ownerBadge: 'rahbar',
      language: 'Til', langs: { uz: "O'zbekcha (lotin)", uzc: 'Ўзбекча (кирилл)', ru: 'Русский', en: 'English' }, loading: 'Yuklanmoqda...', error: 'Xatolik', hello: 'Salom', pct: '%',
    },
    ru: {
      app: 'Автошкола', bootHelp: 'Проверьте интернет и настройку Firebase в config.js, затем обновите страницу.', demoBanner: 'ДЕМО-режим: данные хранятся только в этом браузере. Для реальной работы подключите Firebase.', setupTitle: 'Создайте учётную запись первого преподавателя', setupNote: 'Это делается один раз. Запишите логин и пароль: ими вы будете входить как преподаватель.', gitTitle: 'Обновление вопросов через GitHub', gitHelp: 'Вопросы лежат в файле questions.json рядом с сайтом. Отредактируйте его на GitHub (значок карандаша) и сохраните, и через несколько минут новые вопросы появятся у всех.', gitDelay: 'Обновление GitHub Pages может занять 1-5 минут. Обновите страницу.', login: 'Войти', loginName: 'Логин', password: 'Пароль', logout: 'Выйти', teacher: 'Преподаватель', student: 'Ученик',
      nav_groups: 'Группы', nav_attendance: 'Посещаемость', nav_grades: 'Оценки', nav_analytics: 'Анализ', nav_payments: 'Оплата', nav_questions: 'База вопросов', nav_samples: 'Примеры вопросов', nav_settings: 'Настройки',
      nav_home: 'Главная', nav_topic: 'Тест по теме', nav_exam: 'Экзамен',
      group: 'Группа', groupName: 'Название группы', price: 'Стоимость курса (сум)', students: 'Ученики', add: 'Добавить', save: 'Сохранить', delete: 'Удалить', cancel: 'Отмена', copy: 'Копировать', copied: 'Скопировано',
      newGroup: 'Новая группа', noGroups: 'Групп пока нет. Сначала создайте группу.', pickGroup: 'Выберите группу', name: 'Имя и фамилия', phone: 'Телефон', newStudent: 'Новый ученик', noStudents: 'В этой группе нет учеников.',
      credTitle: 'Передайте ученику этот логин и пароль', credNote: 'Пароль виден только сейчас. Если потеряется, нажмите «Новый пароль».', resetPw: 'Новый пароль', confirmDel: 'Точно удалить?', yes: 'Да', no: 'Нет',
      date: 'Дата', present: 'Был', late: 'Опоздал', absent: 'Не был', excused: 'По причине', attendanceSaved: 'Посещаемость сохранена', attendancePct: 'Посещаемость %', visits: 'Занятия',
      kind: 'Вид', theory: 'Теория', practice: 'Практика', exam: 'Экзамен', score: 'Оценка (1-5)', note: 'Комментарий', gradeSaved: 'Оценка поставлена', noGrades: 'Оценок пока нет.', chooseStudent: 'Выберите ученика', avg: 'Средняя',
      topic: 'Тема', accuracy: 'Правильных ответов', answersN: 'отв.', questionsWord: 'вопр.', weakTopics: 'Слабые темы', weakStudents: 'слабых учеников', groupWeak: 'Темы группы (сначала самые слабые)', matrix: 'Ученик × тема', noData: 'Результатов тестов пока нет.', weakHint: 'Тема считается слабой, если больше 3 ответов и результат ниже 70%.',
      studentDetail: 'Анализ ученика', attempts: 'Последние попытки', back: 'Назад', result: 'Результат',
      paid: 'Оплачено', debt: 'Долг', total: 'Итого', amount: 'Сумма (сум)', addPayment: 'Добавить платёж', history: 'История', paymentSaved: 'Платёж сохранён', fullyPaid: 'Оплачено полностью', som: 'сум', coursePrice: 'Стоимость курса',
      questionsCount: 'Количество вопросов', importTitle: 'Загрузка вопросов (JSON)', importHelp: 'Вопросы загружаются списком JSON. Пример формата есть в инструкции (README).', importBtn: 'Загрузить', file: 'Из файла', imported: 'Загружено: {a} новых, {u} обновлено, {f} ошибок',
      feedTitle: 'Обновление из интернета', feedHelp: 'Укажите https:// ссылку на JSON-файл с вопросами. Приложение само проверяет её раз в сутки и добавляет новые вопросы.', feedUrl: 'Ссылка (https://...)', feedNow: 'Обновить сейчас', feedLast: 'Последнее обновление', feedRemove: 'Удалить ссылку',
      samplesIntro: 'Правильные ответы выделены зелёным.', all: 'Все',
      start: 'Начать', next: 'Далее', prev: 'Назад', finish: 'Завершить', finishConfirm: 'Вопросы без ответа считаются ошибками. Завершить?', question: 'Вопрос', of: 'из', timeLeft: 'Осталось',
      passed: 'Вы сдали экзамен', failed: 'Вы не сдали экзамен', lateNote: 'Сдано после окончания времени.', correct: 'Верно', errors: 'Ошибок', review: 'Посмотреть ответы', yourAnswer: 'Ваш ответ', noAnswer: 'нет ответа',
      topicTestIntro: 'Выберите тему и ответьте на 10 вопросов. Результат покажет слабые темы.', examIntro: 'Как на настоящем экзамене: вопросы из всех тем вперемешку, время ограничено.', examRules: '{n} вопросов, {m} минут, допустимо не более {e} ошибок.', practiceWeak: 'Тренироваться',
      myGrades: 'Мои оценки', myAttendance: 'Моя посещаемость', lastAttempts: 'Последние попытки', mode_topic: 'Тест по теме', mode_exam: 'Экзамен', noWeak: 'Слабых тем пока нет. Продолжайте тесты.',
      oldPw: 'Старый пароль', newPw: 'Новый пароль (минимум 6 символов)', changePw: 'Сменить пароль', pwChanged: 'Пароль изменён', mustChange: 'Для безопасности сначала смените пароль.',
      register: 'Регистрация', regSchool: 'Зарегистрировать новый учебный центр', regJoin: 'Присоединиться к учебному центру', region: 'Область', district: 'Район', pickRegion: 'Выберите область', pickDistrict: 'Выберите район', school: 'Учебный центр', schoolName: 'Название учебного центра', pickSchool: 'Выберите учебный центр', noSchools: 'В этом районе пока нет учебных центров. Руководитель центра сначала должен зарегистрировать его через «Зарегистрировать новый учебный центр».', firstName: 'Имя', lastName: 'Фамилия', roleQ: 'В какой роли вы работаете?', regDone: 'Вы зарегистрированы', regDoneNote: 'Запишите логин и пароль: пароль виден только сейчас. После подтверждения руководителем центра вы войдёте с этими данными.', toLogin: 'Перейти ко входу', haveAccount: 'Уже есть аккаунт? Войти', noAccount: 'Нет аккаунта?', regTeacherNote: 'Присоединение преподавателя подтверждает только руководитель центра. Утерянный пароль восстановить нельзя.', regOwnerNote: 'Вы станете руководителем центра (первым преподавателем). Потом вы будете подтверждать преподавателей и учеников.', pendingTitle: 'Ожидает подтверждения', pendingNote: 'Вы сможете пользоваться приложением после подтверждения руководителем центра. Зайдите позже или нажмите «Проверить».', check: 'Проверить', stillPending: 'Пока не подтверждено', nav_requests: 'Заявки', requestsTitle: 'Заявки на регистрацию', noRequests: 'Новых заявок нет.', approve: 'Подтвердить', reject: 'Отклонить', approved: 'Подтверждено', ownerBadge: 'руководитель',
      language: 'Язык', langs: { uz: "O'zbekcha (lotin)", uzc: 'Ўзбекча (кирилл)', ru: 'Русский', en: 'English' }, loading: 'Загрузка...', error: 'Ошибка', hello: 'Здравствуйте', pct: '%',
    },
    en: {
      app: 'Driving school', bootHelp: 'Check your internet and the Firebase settings in config.js, then refresh the page.', demoBanner: 'DEMO mode: data is stored only in this browser. Connect Firebase for real use.', setupTitle: 'Create the first teacher account', setupNote: 'This is done once. Write down the login and password: you will sign in as the teacher with them.', gitTitle: 'Update questions through GitHub', gitHelp: 'Questions live in the questions.json file next to the site. Edit it on GitHub (pencil icon) and save, and a few minutes later the new questions appear for everyone.', gitDelay: 'GitHub Pages can take 1-5 minutes to update. Refresh the page.', login: 'Sign in', loginName: 'Login', password: 'Password', logout: 'Sign out', teacher: 'Teacher', student: 'Student',
      nav_groups: 'Groups', nav_attendance: 'Attendance', nav_grades: 'Grades', nav_analytics: 'Analysis', nav_payments: 'Payments', nav_questions: 'Question bank', nav_samples: 'Sample questions', nav_settings: 'Settings',
      nav_home: 'Home', nav_topic: 'Topic test', nav_exam: 'Exam',
      group: 'Group', groupName: 'Group name', price: 'Course price (UZS)', students: 'Students', add: 'Add', save: 'Save', delete: 'Delete', cancel: 'Cancel', copy: 'Copy', copied: 'Copied',
      newGroup: 'New group', noGroups: 'No groups yet. Create a group first.', pickGroup: 'Choose a group', name: 'Full name', phone: 'Phone', newStudent: 'New student', noStudents: 'There are no students in this group.',
      credTitle: 'Give the student this login and password', credNote: 'The password is shown only now. If lost, press “New password”.', resetPw: 'New password', confirmDel: 'Delete for sure?', yes: 'Yes', no: 'No',
      date: 'Date', present: 'Present', late: 'Late', absent: 'Absent', excused: 'Excused', attendanceSaved: 'Attendance saved', attendancePct: 'Attendance %', visits: 'Lessons',
      kind: 'Type', theory: 'Theory', practice: 'Practice', exam: 'Exam', score: 'Grade (1-5)', note: 'Note', gradeSaved: 'Grade saved', noGrades: 'No grades yet.', chooseStudent: 'Choose a student', avg: 'Average',
      topic: 'Topic', accuracy: 'Correct answers', answersN: 'answers', questionsWord: 'questions', weakTopics: 'Weak topics', weakStudents: 'weak students', groupWeak: 'Group topics (weakest first)', matrix: 'Student × topic', noData: 'No test results yet.', weakHint: 'A topic counts as weak with more than 3 answers and a score below 70%.',
      studentDetail: 'Student analysis', attempts: 'Recent attempts', back: 'Back', result: 'Result',
      paid: 'Paid', debt: 'Owed', total: 'Total', amount: 'Amount (UZS)', addPayment: 'Add payment', history: 'History', paymentSaved: 'Payment saved', fullyPaid: 'Paid in full', som: 'UZS', coursePrice: 'Course price',
      questionsCount: 'Number of questions', importTitle: 'Upload questions (JSON)', importHelp: 'Questions are uploaded as a JSON list. The format example is in the README guide.', importBtn: 'Upload', file: 'From file', imported: 'Uploaded: {a} new, {u} updated, {f} errors',
      feedTitle: 'Update from the internet', feedHelp: 'Enter an https:// link to a JSON file of questions. The app checks it once a day and adds new questions.', feedUrl: 'Link (https://...)', feedNow: 'Update now', feedLast: 'Last update', feedRemove: 'Remove link',
      samplesIntro: 'Correct answers are shown in green.', all: 'All',
      start: 'Start', next: 'Next', prev: 'Previous', finish: 'Finish', finishConfirm: 'Unanswered questions count as errors. Finish now?', question: 'Question', of: 'of', timeLeft: 'Time left',
      passed: 'You passed the exam', failed: 'You did not pass the exam', lateNote: 'Submitted after time ran out.', correct: 'Correct', errors: 'Errors', review: 'Review answers', yourAnswer: 'Your answer', noAnswer: 'no answer',
      topicTestIntro: 'Choose a topic and answer 10 questions. The result shows your weak topics.', examIntro: 'Like the real exam: questions from all topics mixed, with a time limit.', examRules: '{n} questions, {m} minutes, at most {e} errors allowed.', practiceWeak: 'Practice',
      myGrades: 'My grades', myAttendance: 'My attendance', lastAttempts: 'Recent attempts', mode_topic: 'Topic test', mode_exam: 'Exam', noWeak: 'No weak topics yet. Keep taking tests.',
      oldPw: 'Old password', newPw: 'New password (at least 6 characters)', changePw: 'Change password', pwChanged: 'Password changed', mustChange: 'For security, change your password first.',
      register: 'Sign up', regSchool: 'Register a new driving school', regJoin: 'Join an existing driving school', region: 'Region', district: 'District', pickRegion: 'Choose a region', pickDistrict: 'Choose a district', school: 'Driving school', schoolName: 'School name', pickSchool: 'Choose a school', noSchools: 'No school is registered in this district yet. The school head must first add it with “Register a new driving school”.', firstName: 'First name', lastName: 'Last name', roleQ: 'What is your role?', regDone: 'You are registered', regDoneNote: 'Write down the login and password: the password is shown only now. Once the school head approves you, sign in with them.', toLogin: 'Go to sign in', haveAccount: 'Have an account? Sign in', noAccount: 'No account?', regTeacherNote: 'Only the school head can approve a teacher. A lost password cannot be recovered.', regOwnerNote: 'You will be the school head (first teacher). Later you approve teachers and students.', pendingTitle: 'Waiting for approval', pendingNote: 'You can use the app after the school head approves you. Come back later or press “Check”.', check: 'Check', stillPending: 'Not approved yet', nav_requests: 'Requests', requestsTitle: 'Sign-up requests', noRequests: 'No new requests.', approve: 'Approve', reject: 'Reject', approved: 'Approved', ownerBadge: 'head',
      language: 'Language', langs: { uz: "O'zbekcha (lotin)", uzc: 'Ўзбекча (кирилл)', ru: 'Русский', en: 'English' }, loading: 'Loading...', error: 'Error', hello: 'Hello', pct: '%',
    },
  };

  // ---- lotin -> kirill (o'zbek) ----
  const L2C = { a: 'а', b: 'б', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', x: 'х', y: 'й', z: 'з' };
  const up = (s) => s.toUpperCase();
  function translit(str) {
    const s = String(str).replace(/[’ʻʼ‘`´]/g, "'");
    let out = ''; let i = 0;
    const isLetter = (c) => /[A-Za-z]/.test(c || '');
    while (i < s.length) {
      const c = s[i]; const lc = c.toLowerCase(); const two = (s.slice(i, i + 2)).toLowerCase(); const three = s.slice(i, i + 3).toLowerCase();
      const capNext = s[i + 1] && s[i + 1] === s[i + 1].toUpperCase() && isLetter(s[i + 1]) && c === c.toUpperCase(); // YO'L kabi
      const cap = (x) => (c === c.toUpperCase() && isLetter(c) ? up(x) : x);
      const capAll = (x) => (c === c.toUpperCase() && capNext ? up(x) : cap(x));
      if (!isLetter(c)) { out += c === "'" ? 'ъ' : c; i++; continue; }
      if (three === "yo'") { out += cap('й') + (s[i + 1] === s[i + 1].toUpperCase() ? 'Ў' : 'ў'); i += 3; continue; }
      if (two === "o'") { out += cap('ў'); i += 2; continue; }
      if (two === "g'") { out += cap('ғ'); i += 2; continue; }
      if (two === 'sh') { out += capAll('ш'); i += 2; continue; }
      if (two === 'ch') { out += capAll('ч'); i += 2; continue; }
      if (two === 'yo') { out += capAll('ё'); i += 2; continue; }
      if (two === 'yu') { out += capAll('ю'); i += 2; continue; }
      if (two === 'ya') { out += capAll('я'); i += 2; continue; }
      if (two === 'ye') { out += capAll('е'); i += 2; continue; }
      if (lc === 'e') { const start = !isLetter(s[i - 1]) && s[i - 1] !== "'"; out += cap(start ? 'э' : 'е'); i++; continue; }
      out += cap(L2C[lc] || c); i++;
    }
    return out;
  }

  // ======== Holat va yordamchilar ========
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* */ } }, del(k) { try { localStorage.removeItem(k); } catch { /* */ } } };
  const st = { token: store.get('token'), user: null, exam: null, tab: null, group: store.get('group') || null, groups: [], lang: store.get('lang') || 'uz', timer: null };
  const t = (k) => (st.lang === 'uzc' ? translit(S.uz[k] ?? k) : (S[st.lang][k] ?? S.uz[k] ?? k));
  const fmt = (s, o) => String(s).replace(/\{(\w+)\}/g, (_, k) => o[k]);
  const topicName = (k) => { const n = TOPICS[k]; if (!n) return k; return st.lang === 'uzc' ? translit(n.uz) : n[st.lang] || n.uz; };
  const qText = (o) => (st.lang === 'uzc' ? translit(o.uz) : o[st.lang] || o.uz);
  const qOpts = (o) => (st.lang === 'uzc' ? o.uz.map(translit) : o[st.lang] || o.uz);
  const money = (n) => Number(n || 0).toLocaleString('ru-RU') + ' ' + t('som');
  const todayStr = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
  const cls = (p) => (p < 50 ? 'bad' : p < 70 ? 'warn' : 'ok');

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'style') Object.assign(e.style, v);
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (k === 'value') e.value = v;
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat(9)) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(String(c))); }
    return e;
  }
  let toastT;
  function toast(msg, err) { const el = document.getElementById('toast'); el.textContent = msg; el.className = err ? 'err' : ''; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 3500); }
  async function api(path, method = 'GET', body) {
    try { return await window.BACKEND.api(path, method, body); }
    catch (e) { if (e.status === 401 && st.user) { logoutLocal(); } throw e; }
  }
  const guard = (fn) => async (...a) => { try { return await fn(...a); } catch (e) { toast(e.message || t('error'), true); } };
  function logoutLocal() { st.user = null; st.needSetup = false; st.tab = null; render(); }
  const confirmBtn = (label, onYes, extra = 'danger small') => {
    const b = h('button', { class: 'btn ' + extra, type: 'button' }, label);
    b.addEventListener('click', () => {
      const yes = h('button', { class: 'btn danger small', type: 'button', onclick: guard(onYes) }, t('yes'));
      const no = h('button', { class: 'btn ghost small', type: 'button', onclick: () => { span.replaceWith(b); } }, t('no'));
      const span = h('span', { class: 'row' }, t('confirmDel'), yes, no); b.replaceWith(span);
    });
    return b;
  };
  const spinner = () => h('p', { class: 'muted' }, t('loading'));
  const setView = (view, ...kids) => view.replaceChildren(...kids.flat(9).filter((c) => c != null && c !== false));
  const empty = (msg) => h('p', { class: 'muted' }, msg);

  // ======== Asosiy oyna ========
  function render() {
    clearInterval(st.timer);
    const root = document.getElementById('app'); root.replaceChildren();
    document.documentElement.lang = st.lang === 'uzc' ? 'uz-Cyrl' : st.lang;
    document.title = t('app');
    if (!st.booted) {
      window.BACKEND.restore().then(async (u) => { st.user = u; st.exam = window.BACKEND.exam; st.booted = true; render(); })
        .catch((e) => { st.booted = true; st.bootErr = e.message || String(e); render(); });
      return root.append(h('div', { class: 'wrap' }, spinner()));
    }
    if (st.bootErr) return root.append(h('div', { class: 'wrap' }, h('div', { class: 'card login' }, h('p', { class: 'chip bad' }, st.bootErr), h('p', { class: 'muted small' }, t('bootHelp')))));
    if (!st.user) return root.append(st.screen === 'register' ? registerView() : loginView());
    if (st.user.status === 'pending') return root.append(pendingView());
    const tabs = st.user.role === 'teacher'
      ? ['groups', 'requests', 'attendance', 'grades', 'analytics', 'payments', 'questions', 'samples', 'settings']
      : ['home', 'topic', 'exam', 'samples'];
    if (st.user.must_change) st.tab = 'settings';
    if (!st.tab || !tabs.includes(st.tab)) st.tab = tabs[0];
    const langSel = h('select', { id: 'lang', 'aria-label': t('language'), style: { width: 'auto' }, onchange: (e) => { st.lang = e.target.value; store.set('lang', st.lang); render(); } },
      ['uz', 'uzc', 'ru', 'en'].map((l) => h('option', { value: l, selected: l === st.lang }, S.uz.langs[l])));
    root.append(
      h('header', { class: 'top' }, h('div', { class: 'wrap' },
        h('div', { class: 'brand' }, '🚗 ' + t('app'), h('small', null, t(st.user.role) + (st.user.school ? ' · ' + st.user.school.name : ''))),
        h('div', { class: 'row' }, langSel, h('span', { class: 'muted' }, st.user.name), h('button', { class: 'btn ghost small', type: 'button', onclick: guard(async () => { await window.BACKEND.logout().catch(() => {}); logoutLocal(); }) }, t('logout'))))),
      h('nav', { class: 'tabs' }, h('div', { class: 'wrap' }, tabs.map((k) => h('button', { type: 'button', id: 'tab-' + k, 'aria-current': k === st.tab ? 'page' : null, onclick: () => { if (st.user.must_change) return toast(t('mustChange'), true); st.tab = k; render(); } }, t('nav_' + k))))),
      window.BACKEND.mode === 'demo' && h('div', { class: 'wrap', style: { paddingTop: '10px' } }, h('p', { class: 'chip warn', style: { margin: 0 } }, t('demoBanner'))),
      h('main', null, h('div', { class: 'wrap', id: 'view' })));
    const view = document.getElementById('view'); view.append(spinner());
    refreshPending();
    Promise.resolve(VIEWS[st.tab](view)).catch((e) => { setView(view, h('p', { class: 'muted' }, t('error') + ': ' + e.message)); });
  }
  async function refreshPending() {
    if (!st.user || st.user.role !== 'teacher') return;
    try { const r = await window.BACKEND.api('/api/requests'); const b = document.getElementById('tab-requests'); if (b) b.textContent = t('nav_requests') + (r.length ? ' (' + r.length + ')' : ''); } catch { /* */ }
  }
  const fieldOf = (id, label, input) => h('div', { class: 'field' }, h('label', { for: id }, label), input);
  const rn = (x) => (st.lang === 'uzc' ? translit(x) : x);
  // viloyat + tuman tanlash
  function placePicker(onChange) {
    const R = window.REGIONS || {};
    const reg = h('select', { id: 'reg', required: true }, h('option', { value: '' }, t('pickRegion')), Object.keys(R).map((k) => h('option', { value: k }, rn(k))));
    const dis = h('select', { id: 'dis', required: true, disabled: true }, h('option', { value: '' }, t('pickDistrict')));
    reg.addEventListener('change', () => { dis.replaceChildren(h('option', { value: '' }, t('pickDistrict')), ...(R[reg.value] || []).map((d) => h('option', { value: d }, rn(d)))); dis.disabled = !reg.value; onChange && onChange(); });
    dis.addEventListener('change', () => onChange && onChange());
    return { reg, dis, nodes: [fieldOf('reg', t('region'), reg), fieldOf('dis', t('district'), dis)] };
  }
  function registerView() {
    const toLogin = () => { st.screen = null; st.regMode = null; st.regDone = null; render(); };
    const wrapCard = (...kids) => h('div', { class: 'wrap' }, h('div', { class: 'login' }, h('div', { class: 'card' }, h('h1', null, '🚗 ' + t('app')), ...kids)));
    const backBtn = h('button', { class: 'btn ghost small', type: 'button', onclick: toLogin }, t('haveAccount'));
    if (st.regDone) {
      const d = st.regDone; const line = `${d.school}\n${d.name}\n${t('loginName')}: ${d.login}\n${t('password')}: ${d.password}`;
      return wrapCard(h('h3', null, t('regDone')), h('p', null, d.name + ' · ' + t(d.role) + ' · ' + d.school),
        h('div', { class: 'cred' }, h('p', null, t('loginName') + ': ', h('code', null, d.login)), h('p', null, t('password') + ': ', h('code', null, d.password))),
        h('p', { class: 'small muted' }, t('regDoneNote')),
        h('div', { class: 'row' }, h('button', { class: 'btn small', type: 'button', onclick: () => { (navigator.clipboard?.writeText(line) || Promise.reject()).then(() => toast(t('copied')), () => toast(line)); } }, t('copy')), h('button', { class: 'btn', type: 'button', onclick: toLogin }, t('toLogin'))));
    }
    if (!st.regMode) {
      return wrapCard(h('h3', null, t('register')),
        h('div', { class: 'row', style: { flexDirection: 'column', alignItems: 'stretch', gap: '10px' } },
          h('button', { class: 'btn', type: 'button', onclick: () => { st.regMode = 'join'; render(); } }, t('regJoin')),
          h('button', { class: 'btn ghost', type: 'button', onclick: () => { st.regMode = 'school'; render(); } }, t('regSchool'))), h('p', null, backBtn));
    }
    const err = h('p', { class: 'chip bad', hidden: true });
    const fail = (x) => { err.textContent = x.message; err.hidden = false; };
    const back2 = h('button', { class: 'btn ghost small', type: 'button', onclick: () => { st.regMode = null; render(); } }, '←');
    if (st.regMode === 'school') {
      const place = placePicker(); const sname = h('input', { id: 'rsn', required: true, maxlength: 120 }); const nm = h('input', { id: 'rnm', required: true });
      const lg = h('input', { id: 'rlg', autocapitalize: 'none', required: true, autocomplete: 'username' }); const pw = h('input', { id: 'rpw', type: 'password', minlength: 6, required: true, autocomplete: 'new-password' });
      const form = h('form', { onsubmit: async (e) => {
        e.preventDefault(); err.hidden = true;
        try { const d = await window.BACKEND.registerSchool({ region: place.reg.value, district: place.dis.value, schoolName: sname.value, name: nm.value, login: lg.value, password: pw.value }); st.user = d.user; st.exam = d.exam; st.screen = null; st.regMode = null; st.tab = null; render(); }
        catch (x) { fail(x); }
      } }, ...place.nodes, fieldOf('rsn', t('schoolName'), sname), fieldOf('rnm', t('name'), nm), fieldOf('rlg', t('loginName'), lg), fieldOf('rpw', t('newPw'), pw), h('p', { class: 'small muted' }, t('regOwnerNote')), err,
      h('div', { class: 'row' }, h('button', { class: 'btn', type: 'submit' }, t('register')), back2));
      return wrapCard(h('h3', null, t('regSchool')), form);
    }
    // mavjud markazga qo'shilish
    const schoolSel = h('select', { id: 'rsch', required: true, disabled: true }, h('option', { value: '' }, t('pickSchool')));
    const info = h('p', { class: 'chip warn', hidden: true });
    const place = placePicker(async () => {
      schoolSel.replaceChildren(h('option', { value: '' }, t('pickSchool'))); schoolSel.disabled = true; info.hidden = true;
      if (!place.reg.value || !place.dis.value) return;
      try { const list = await window.BACKEND.listSchools(place.reg.value, place.dis.value); list.forEach((x) => schoolSel.append(h('option', { value: x.id }, x.name))); schoolSel.disabled = !list.length; if (!list.length) { info.textContent = t('noSchools'); info.hidden = false; } }
      catch (x) { fail(x); }
    });
    const fn = h('input', { id: 'rfn', required: true, maxlength: 50, autocomplete: 'given-name' }); const ln = h('input', { id: 'rln', required: true, maxlength: 50, autocomplete: 'family-name' });
    const roleSel = h('select', { id: 'rrole' }, h('option', { value: 'student' }, t('student')), h('option', { value: 'teacher' }, t('teacher')));
    const form = h('form', { onsubmit: async (e) => {
      e.preventDefault(); err.hidden = true;
      try { const d = await window.BACKEND.joinSchool({ schoolId: schoolSel.value, firstName: fn.value, lastName: ln.value, role: roleSel.value }); st.regDone = d; render(); }
      catch (x) { fail(x); }
    } }, ...place.nodes, fieldOf('rsch', t('school'), schoolSel), info, fieldOf('rfn', t('firstName'), fn), fieldOf('rln', t('lastName'), ln), fieldOf('rrole', t('roleQ'), roleSel), h('p', { class: 'small muted' }, t('regTeacherNote')), err,
    h('div', { class: 'row' }, h('button', { class: 'btn', type: 'submit' }, t('register')), back2));
    return wrapCard(h('h3', null, t('regJoin')), form);
  }
  function pendingView() {
    const note = h('p', { class: 'chip warn', hidden: true }, t('stillPending'));
    return h('div', { class: 'wrap' }, h('div', { class: 'login' }, h('div', { class: 'card' }, h('h1', null, '🚗 ' + t('app')), h('h3', null, t('pendingTitle')),
      h('p', null, st.user.name + ' · ' + t(st.user.role) + (st.user.school ? ' · ' + st.user.school.name : '')), h('p', { class: 'muted' }, t('pendingNote')), note,
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onclick: guard(async () => { const u = await window.BACKEND.refreshMe(); if (u && u.status !== 'pending') { st.user = u; st.tab = null; render(); } else note.hidden = false; }) }, t('check')),
        h('button', { class: 'btn ghost', type: 'button', onclick: guard(async () => { await window.BACKEND.logout().catch(() => {}); logoutLocal(); }) }, t('logout'))))));
  }
  function loginView() {
    const login = h('input', { id: 'login', autocomplete: 'username', autocapitalize: 'none', required: true });
    const pw = h('input', { id: 'password', type: 'password', autocomplete: 'current-password', required: true });
    const err = h('p', { class: 'chip bad', hidden: true });
    const langSel = h('select', { 'aria-label': t('language'), onchange: (e) => { st.lang = e.target.value; store.set('lang', st.lang); render(); } }, ['uz', 'uzc', 'ru', 'en'].map((l) => h('option', { value: l, selected: l === st.lang }, S.uz.langs[l])));
    const form = h('form', { class: 'card', onsubmit: async (e) => {
      e.preventDefault(); err.hidden = true;
      try { const d = await window.BACKEND.login(login.value, pw.value); st.user = d.user; st.exam = d.exam; st.tab = null; render(); }
      catch (x) { err.textContent = x.message; err.hidden = false; }
    } },
    h('h1', null, '🚗 ' + t('app')),
    h('div', { class: 'field' }, h('label', { for: 'login' }, t('loginName')), login),
    h('div', { class: 'field' }, h('label', { for: 'password' }, t('password')), pw), err,
    h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('button', { class: 'btn', type: 'submit' }, t('login')), langSel),
    h('p', { class: 'muted small' }, t('noAccount') + ' ', h('button', { class: 'btn ghost small', type: 'button', onclick: () => { st.screen = 'register'; st.regMode = null; render(); } }, t('register'))));
    return h('div', { class: 'wrap' }, h('div', { class: 'login' }, form));
  }

  // ======== Guruh tanlash (o'qituvchi) ========
  async function loadGroups() {
    st.groups = await api('/api/groups');
    if (!st.groups.find((g) => g.id === st.group)) st.group = st.groups[0]?.id || null;
    store.set('group', st.group || '');
  }
  function groupPicker(onChange) {
    return h('div', { class: 'field', style: { maxWidth: '320px' } }, h('label', { for: 'gsel' }, t('group')),
      h('select', { id: 'gsel', onchange: (e) => { st.group = e.target.value; store.set('group', st.group); onChange(); } },
        st.groups.map((g) => h('option', { value: g.id, selected: g.id === st.group }, g.name))));
  }
  const needGroup = (view) => { setView(view, h('div', { class: 'card' }, empty(t('noGroups')))); };

  // ======== O'qituvchi oynalari ========
  const VIEWS = {};
  VIEWS.requests = async (view) => {
    await loadGroups();
    const rows = await api('/api/requests');
    const redo = () => VIEWS.requests(view).catch((e) => setView(view, h('p', { class: 'muted' }, t('error') + ': ' + e.message)));
    setView(view, h('h2', null, t('requestsTitle')),
      rows.length ? rows.map((r) => {
        const gsel = r.role === 'student' ? h('select', { 'aria-label': t('group'), style: { width: 'auto' } }, st.groups.map((g) => h('option', { value: g.id, selected: g.id === st.group }, g.name))) : null;
        return h('div', { class: 'card' }, h('div', { class: 'row', style: { justifyContent: 'space-between' } },
          h('div', null, h('strong', null, r.name), ' ', h('span', { class: 'chip' }, t(r.role)), h('div', { class: 'muted small' }, t('loginName') + ': ', h('code', null, r.login))),
          h('div', { class: 'row' }, gsel,
            h('button', { class: 'btn small', type: 'button', onclick: guard(async () => { if (gsel && !gsel.value) return toast(t('noGroups'), true); await api('/api/requests/' + r.id + '/approve', 'POST', { group_id: gsel ? gsel.value : null }); toast(t('approved')); redo(); }) }, t('approve')),
            confirmBtn(t('reject'), async () => { await api('/api/requests/' + r.id, 'DELETE'); redo(); }))));
      }) : h('div', { class: 'card' }, empty(t('noRequests'))));
    refreshPending();
  };
  VIEWS.groups = async (view) => {
    await loadGroups();
    const credBox = h('div');
    const draw = async () => {
      const students = st.group ? await api('/api/students?group=' + st.group) : [];
      const g = st.groups.find((x) => x.id === st.group);
      const gname = h('input', { id: 'gname', required: true }); const gprice = h('input', { id: 'gprice', type: 'number', min: 0, step: 1000, value: 0 });
      const sname = h('input', { id: 'sname', required: true }); const sphone = h('input', { id: 'sphone', type: 'tel' });
      const showCred = (name, d) => {
        const line = `${name}\n${t('loginName')}: ${d.login}\n${t('password')}: ${d.password}`;
        credBox.replaceChildren(h('div', { class: 'cred' }, h('h3', null, t('credTitle')), h('p', null, name), h('p', null, t('loginName') + ': ', h('code', null, d.login)), h('p', null, t('password') + ': ', h('code', null, d.password)), h('p', { class: 'small muted' }, t('credNote')),
          h('div', { class: 'row noprint' }, h('button', { class: 'btn small', type: 'button', onclick: () => { (navigator.clipboard?.writeText(line) || Promise.reject()).then(() => toast(t('copied')), () => toast(line)); } }, t('copy')), h('button', { class: 'btn ghost small', type: 'button', onclick: () => window.print() }, '🖨'))));
      };
      setView(view, 
        h('h2', null, t('nav_groups')),
        h('div', { class: 'card' }, h('h3', null, t('newGroup')), h('form', { onsubmit: guard(async (e) => { e.preventDefault(); const r = await api('/api/groups', 'POST', { name: gname.value, price: Number(gprice.value) }); st.group = r.id; await loadGroups(); draw(); }) },
          h('div', { class: 'form-row' }, h('div', null, h('label', { for: 'gname' }, t('groupName')), gname), h('div', null, h('label', { for: 'gprice' }, t('price')), gprice), h('button', { class: 'btn', type: 'submit' }, t('add'))))),
        st.groups.length ? h('div', { class: 'card' }, groupPicker(draw), g && h('div', { class: 'row' }, h('span', { class: 'chip' }, t('coursePrice') + ': ' + money(g.price)), confirmBtn(t('delete'), async () => { await api('/api/groups/' + g.id, 'DELETE'); await loadGroups(); draw(); }))) : h('div', { class: 'card' }, empty(t('noGroups'))),
        st.group && [credBox,
          h('div', { class: 'card' }, h('h3', null, t('newStudent')), h('form', { onsubmit: guard(async (e) => { e.preventDefault(); const nm = sname.value.trim(); const d = await api('/api/students', 'POST', { name: nm, group_id: st.group, phone: sphone.value }); await draw(); showCred(nm, d); }) },
            h('div', { class: 'form-row' }, h('div', null, h('label', { for: 'sname' }, t('name')), sname), h('div', null, h('label', { for: 'sphone' }, t('phone')), sphone), h('button', { class: 'btn', type: 'submit' }, t('add'))))),
          h('div', { class: 'card' }, h('h3', null, t('students') + ' (' + students.length + ')'), students.length ? h('div', { class: 'tablewrap' }, h('table', null,
            h('thead', null, h('tr', null, h('th', null, t('name')), h('th', null, t('loginName')), h('th', null, t('phone')), h('th'))),
            h('tbody', null, students.map((s) => h('tr', null, h('td', null, s.name), h('td', null, h('code', null, s.login)), h('td', null, s.phone || ''),
              h('td', { class: 'num' }, h('div', { class: 'row', style: { justifyContent: 'flex-end' } },
                h('button', { class: 'btn ghost small', type: 'button', onclick: guard(async () => { const d = await api('/api/students/' + s.id + '/reset', 'POST'); showCred(s.name, d); window.scrollTo(0, 0); }) }, t('resetPw')),
                confirmBtn(t('delete'), async () => { await api('/api/students/' + s.id, 'DELETE'); draw(); })))))))) : empty(t('noStudents')))]);
      void gname; void sname;
    };
    await draw();
  };

  VIEWS.attendance = async (view) => {
    await loadGroups(); if (!st.group) return needGroup(view);
    let date = todayStr();
    const draw = async () => {
      const [rows, sum] = await Promise.all([api(`/api/attendance?group=${st.group}&date=${date}`), api('/api/attendance/summary?group=' + st.group)]);
      const marks = Object.fromEntries(rows.map((r) => [r.id, r.status]));
      const dateIn = h('input', { id: 'adate', type: 'date', value: date, onchange: (e) => { date = e.target.value || todayStr(); draw(); } });
      const ST = ['present', 'late', 'absent', 'excused'];
      setView(view, h('h2', null, t('nav_attendance')),
        h('div', { class: 'card' }, h('div', { class: 'form-row' }, groupPicker(() => draw()), h('div', { class: 'field' }, h('label', { for: 'adate' }, t('date')), dateIn)),
          rows.length ? h('div', { class: 'tablewrap' }, h('table', null, h('tbody', null, rows.map((r) => h('tr', null, h('td', null, r.name), h('td', { class: 'num' }, h('div', { class: 'seg', role: 'group' }, ST.map((k) => h('button', { type: 'button', class: k, 'aria-pressed': marks[r.id] === k, onclick: (e) => { marks[r.id] = k; e.currentTarget.parentElement.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === e.currentTarget)); } }, t(k)))))))))) : empty(t('noStudents')),
          rows.length > 0 && h('p', null, h('button', { class: 'btn', type: 'button', onclick: guard(async () => { await api('/api/attendance', 'POST', { date, records: Object.entries(marks).map(([student_id, status]) => ({ student_id: student_id, status })) }); toast(t('attendanceSaved')); draw(); }) }, t('save')))),
        h('div', { class: 'card' }, h('h3', null, t('attendancePct')), sum.length ? h('div', { class: 'tablewrap' }, h('table', null, h('thead', null, h('tr', null, h('th', null, t('name')), ST.map((k) => h('th', { class: 'num' }, t(k))), h('th', { class: 'num' }, '%'))),
          h('tbody', null, sum.map((r) => { const p = r.total ? Math.round((100 * (r.present + r.late)) / r.total) : null; return h('tr', null, h('td', null, r.name), ST.map((k) => h('td', { class: 'num' }, r[k])), h('td', { class: 'num' }, p == null ? '–' : h('span', { class: 'chip ' + cls(p) }, p + '%'))); })))) : empty(t('noStudents'))));
    };
    await draw();
  };

  VIEWS.grades = async (view) => {
    await loadGroups(); if (!st.group) return needGroup(view);
    const draw = async () => {
      const [students, grades] = await Promise.all([api('/api/students?group=' + st.group), api('/api/grades?group=' + st.group)]);
      const sSel = h('select', { id: 'gstudent' }, students.map((s) => h('option', { value: s.id }, s.name)));
      const kind = h('select', { id: 'gkind' }, [['theory', 'theory'], ['practice', 'practice'], ['exam', 'exam']].map(([v, k]) => h('option', { value: v }, t(k))));
      const score = h('select', { id: 'gscore' }, [5, 4, 3, 2, 1].map((n) => h('option', { value: n }, n)));
      const note = h('input', { id: 'gnote', maxlength: 300 }); const dt = h('input', { id: 'gdate', type: 'date', value: todayStr() });
      setView(view, h('h2', null, t('nav_grades')),
        h('div', { class: 'card' }, groupPicker(draw), students.length ? h('form', { onsubmit: guard(async (e) => { e.preventDefault(); await api('/api/grades', 'POST', { student_id: sSel.value, kind: kind.value, score: Number(score.value), note: note.value, date: dt.value }); toast(t('gradeSaved')); draw(); }) },
          h('div', { class: 'form-row' }, h('div', null, h('label', { for: 'gstudent' }, t('chooseStudent')), sSel), h('div', null, h('label', { for: 'gkind' }, t('kind')), kind), h('div', null, h('label', { for: 'gscore' }, t('score')), score), h('div', null, h('label', { for: 'gdate' }, t('date')), dt), h('div', null, h('label', { for: 'gnote' }, t('note')), note), h('button', { class: 'btn', type: 'submit' }, t('save')))) : empty(t('noStudents'))),
        h('div', { class: 'card' }, grades.length ? h('div', { class: 'tablewrap' }, h('table', null, h('thead', null, h('tr', null, h('th', null, t('date')), h('th', null, t('name')), h('th', null, t('kind')), h('th', { class: 'num' }, t('score')), h('th', null, t('note')), h('th'))),
          h('tbody', null, grades.map((g) => h('tr', null, h('td', null, g.date), h('td', null, g.name), h('td', null, t(g.kind)), h('td', { class: 'num' }, h('span', { class: 'chip ' + (g.score >= 4 ? 'ok' : g.score === 3 ? 'warn' : 'bad') }, g.score)), h('td', null, g.note || ''), h('td', { class: 'num' }, confirmBtn(t('delete'), async () => { await api('/api/grades/' + g.id, 'DELETE'); draw(); }))))))) : empty(t('noGrades'))));
    };
    await draw();
  };

  function topicBars(topicsObj, keys) {
    return keys.map((k) => { const v = topicsObj[k]; return h('div', { class: 'toprow' }, h('div', null, topicName(k)), v ? h('div', { class: 'bar ' + cls(v.pct) }, h('span', { style: { width: v.pct + '%' } })) : h('div', { class: 'muted small' }, '–'), h('div', { class: 'small muted' }, v ? `${v.pct}% · ${v.n} ${t('answersN')}` : '')); });
  }
  async function studentDetail(view, id, name, back) {
    const d = await api('/api/analytics/student?student=' + id); const topics = await api('/api/topics'); const keys = topics.map((x) => x.topic);
    const weak = keys.filter((k) => d.topics[k] && d.topics[k].n >= d.minAnswers && d.topics[k].pct < d.weakPct);
    setView(view, h('p', null, h('button', { class: 'btn ghost small', type: 'button', onclick: back }, '← ' + t('back'))), h('h2', null, name),
      h('div', { class: 'card' }, h('h3', null, t('weakTopics')), weak.length ? weak.map((k) => h('span', { class: 'chip bad', style: { marginRight: '6px' } }, topicName(k) + ' ' + d.topics[k].pct + '%')) : empty(t('noWeak'))),
      h('div', { class: 'card' }, h('h3', null, t('accuracy')), topicBars(d.topics, keys)),
      h('div', { class: 'card' }, h('h3', null, t('attempts')), attemptsTable(d.attempts)));
  }
  function attemptsTable(rows) {
    if (!rows.length) return empty(t('noData'));
    return h('div', { class: 'tablewrap' }, h('table', null, h('thead', null, h('tr', null, h('th', null, t('date')), h('th', null, t('kind')), h('th', null, t('topic')), h('th', { class: 'num' }, t('result')))),
      h('tbody', null, rows.map((a) => h('tr', null, h('td', null, new Date(a.started).toLocaleString()), h('td', null, t('mode_' + a.mode)), h('td', null, a.topic ? topicName(a.topic) : '–'),
        h('td', { class: 'num' }, `${a.correct}/${a.total} `, a.mode === 'exam' && h('span', { class: 'chip ' + (a.passed ? 'ok' : 'bad') }, a.passed ? '✓' : '✗')))))));
  }
  VIEWS.analytics = async (view) => {
    await loadGroups(); if (!st.group) return needGroup(view);
    const draw = async () => {
      const [d, topics] = await Promise.all([api('/api/analytics/group?group=' + st.group), api('/api/topics')]);
      const keys = topics.map((x) => x.topic);
      const asked = keys.filter((k) => d.byTopic[k]);
      const sorted = [...asked].sort((a, b) => d.byTopic[a].pct - d.byTopic[b].pct);
      setView(view, h('h2', null, t('nav_analytics')), h('div', { class: 'card' }, groupPicker(draw), h('p', { class: 'small muted' }, t('weakHint'))),
        !asked.length ? h('div', { class: 'card' }, empty(t('noData'))) : [
          h('div', { class: 'card' }, h('h3', null, t('groupWeak')), sorted.map((k) => { const v = d.byTopic[k]; return h('div', { class: 'toprow' }, h('div', null, topicName(k)), h('div', { class: 'bar ' + cls(v.pct) }, h('span', { style: { width: v.pct + '%' } })), h('div', { class: 'small' }, `${v.pct}% · `, v.weak > 0 ? h('span', { class: 'chip bad' }, `${v.weak} ${t('weakStudents')}`) : h('span', { class: 'muted' }, '0 ' + t('weakStudents')))); })),
          h('div', { class: 'card' }, h('h3', null, t('matrix')), h('div', { class: 'tablewrap' }, h('table', { class: 'matrix' }, h('thead', null, h('tr', null, h('th', null, t('name')), keys.map((k) => h('th', { class: 'num' }, topicName(k))))),
            h('tbody', null, d.students.map((s) => h('tr', null, h('td', null, h('button', { class: 'btn ghost small', type: 'button', onclick: guard(() => studentDetail(view, s.id, s.name, draw)) }, s.name)), keys.map((k) => { const v = d.byStudent[s.id]?.[k]; return v ? h('td', { class: 'cell ' + (v.n >= d.minAnswers ? cls(v.pct) : 'none'), title: `${v.ok}/${v.n}` }, v.pct + '%') : h('td', { class: 'cell none' }, '–'); })))))))]);
    };
    await draw();
  };

  VIEWS.payments = async (view) => {
    await loadGroups(); if (!st.group) return needGroup(view);
    let open = null;
    const draw = async () => {
      const d = await api('/api/payments/summary?group=' + st.group);
      const hist = open ? await api('/api/payments?student=' + open) : [];
      const sumPaid = d.students.reduce((a, s) => a + s.paid, 0); const sumDebt = d.students.reduce((a, s) => a + s.debt, 0);
      const amt = h('input', { id: 'pamount', type: 'number', min: 1, step: 'any', required: true }); const pdate = h('input', { id: 'pdate', type: 'date', value: todayStr() }); const pnote = h('input', { id: 'pnote', maxlength: 200 });
      setView(view, h('h2', null, t('nav_payments')), h('div', { class: 'card' }, groupPicker(() => { open = null; draw(); }), h('div', { class: 'row' }, h('span', { class: 'chip' }, t('coursePrice') + ': ' + money(d.price)), h('span', { class: 'chip ok' }, t('paid') + ': ' + money(sumPaid)), h('span', { class: 'chip ' + (sumDebt ? 'bad' : 'ok') }, t('debt') + ': ' + money(sumDebt)))),
        h('div', { class: 'card' }, d.students.length ? h('div', { class: 'tablewrap' }, h('table', null, h('thead', null, h('tr', null, h('th', null, t('name')), h('th', { class: 'num' }, t('paid')), h('th', { class: 'num' }, t('debt')), h('th'))),
          h('tbody', null, d.students.map((s) => h('tr', null, h('td', null, s.name), h('td', { class: 'num' }, money(s.paid)), h('td', { class: 'num' }, s.debt ? h('span', { class: 'chip bad' }, money(s.debt)) : h('span', { class: 'chip ok' }, '✓')), h('td', { class: 'num' }, h('button', { class: 'btn ghost small', type: 'button', onclick: () => { open = open === s.id ? null : s.id; draw(); } }, t('addPayment')))))))) : empty(t('noStudents'))),
        open && h('div', { class: 'card' }, h('h3', null, d.students.find((s) => s.id === open)?.name), h('form', { onsubmit: guard(async (e) => { e.preventDefault(); await api('/api/payments', 'POST', { student_id: open, amount: Number(amt.value), date: pdate.value, note: pnote.value }); toast(t('paymentSaved')); draw(); }) },
          h('div', { class: 'form-row' }, h('div', null, h('label', { for: 'pamount' }, t('amount')), amt), h('div', null, h('label', { for: 'pdate' }, t('date')), pdate), h('div', null, h('label', { for: 'pnote' }, t('note')), pnote), h('button', { class: 'btn', type: 'submit' }, t('save')))),
          hist.length ? [h('h3', null, t('history')), h('div', { class: 'tablewrap' }, h('table', null, h('tbody', null, hist.map((p) => h('tr', null, h('td', null, p.date), h('td', { class: 'num' }, money(p.amount)), h('td', null, p.note || ''), h('td', { class: 'num' }, confirmBtn(t('delete'), async () => { await api('/api/payments/' + p.id, 'DELETE'); draw(); })))))))] : null));
    };
    await draw();
  };

  VIEWS.questions = async (view) => {
    const topics = await api('/api/topics'); const total = topics.reduce((a, x) => a + x.n, 0);
    setView(view, h('h2', null, t('nav_questions')),
      h('div', { class: 'card' }, h('h3', null, t('questionsCount') + ': ' + total), h('div', { class: 'row' }, topics.map((x) => h('span', { class: 'chip' }, topicName(x.topic) + ' · ' + x.n)))),
      h('div', { class: 'card' }, h('h3', null, t('gitTitle')), h('p', null, t('gitHelp')), h('p', { class: 'small muted' }, t('gitDelay'))));
  };

  // ======== Namuna savollar (ikkala rol) ========
  VIEWS.samples = async (view) => {
    let topic = '';
    const draw = async () => {
      const [qs, topics] = await Promise.all([api('/api/samples' + (topic ? '?topic=' + topic : '')), api('/api/topics')]);
      const sel = h('select', { id: 'stopic', style: { maxWidth: '320px' }, onchange: (e) => { topic = e.target.value; draw(); } }, [h('option', { value: '' }, t('all'))].concat(topics.map((x) => h('option', { value: x.topic, selected: x.topic === topic }, topicName(x.topic) + ' (' + x.n + ')'))));
      setView(view, h('h2', null, t('nav_samples')), h('div', { class: 'card' }, h('div', { class: 'field' }, h('label', { for: 'stopic' }, t('topic')), sel), h('p', { class: 'small muted' }, t('samplesIntro'))),
        qs.map((q, i) => h('div', { class: 'card' }, h('div', { class: 'small muted' }, `${i + 1}. ${topicName(q.topic)}`), q.image && h('img', { class: 'qimg', src: q.image, alt: '' }), h('div', { class: 'qtext' }, qText(q.q)),
          qOpts(q.options).map((o, k) => h('div', { class: 'opt' + (k === q.correct ? ' right' : '') }, h('span', { class: 'k' }, String.fromCharCode(65 + k)), h('span', null, o))),
          null)));
      document.getElementById('stopic').value = topic;
    };
    await draw();
  };

  // ======== Sozlamalar (ikkala rol) ========
  VIEWS.settings = async (view) => {
    const o = h('input', { id: 'oldpw', type: 'password', autocomplete: 'current-password', required: true }); const n = h('input', { id: 'newpw', type: 'password', autocomplete: 'new-password', minlength: 6, required: true });
    setView(view, h('h2', null, t('nav_settings')), st.user.must_change && h('p', { class: 'chip warn' }, t('mustChange')),
      h('form', { class: 'card', style: { maxWidth: '420px' }, onsubmit: guard(async (e) => { e.preventDefault(); await api('/api/password', 'POST', { old: o.value, password: n.value }); st.user.must_change = false; toast(t('pwChanged')); o.value = ''; n.value = ''; render(); }) },
        h('h3', null, t('changePw')), h('div', { class: 'field' }, h('label', { for: 'oldpw' }, t('oldPw')), o), h('div', { class: 'field' }, h('label', { for: 'newpw' }, t('newPw')), n), h('button', { class: 'btn', type: 'submit' }, t('save'))));
  };

  // ======== O'quvchi oynalari ========
  VIEWS.home = async (view) => {
    const [an, att, grades, topics] = await Promise.all([api('/api/analytics/student?student=me'), api('/api/attendance/summary'), api('/api/grades'), api('/api/topics')]);
    const keys = topics.map((x) => x.topic);
    const weak = keys.filter((k) => an.topics[k] && an.topics[k].n >= an.minAnswers && an.topics[k].pct < an.weakPct);
    const a = att[0]; const ap = a && a.total ? Math.round((100 * (a.present + a.late)) / a.total) : null;
    const avg = grades.length ? (grades.reduce((x, g) => x + g.score, 0) / grades.length).toFixed(1) : null;
    setView(view, h('h2', null, `${t('hello')}, ${st.user.name}!`),
      h('div', { class: 'grid' },
        h('div', { class: 'card' }, h('h3', null, t('weakTopics')), weak.length ? h('div', null, weak.map((k) => h('div', { class: 'weakrow' }, h('div', null, topicName(k) + ' · ' + an.topics[k].pct + '%'), h('button', { class: 'btn small', type: 'button', onclick: () => { st.tab = 'topic'; st.pre = k; render(); } }, t('practiceWeak'))))) : empty(t('noWeak'))),
        h('div', { class: 'card' }, h('h3', null, t('myAttendance')), ap == null ? empty('–') : [h('div', { class: 'score' }, ap + '%'), h('p', { class: 'muted small' }, `${t('present')}: ${a.present} · ${t('late')}: ${a.late} · ${t('absent')}: ${a.absent} · ${t('excused')}: ${a.excused}`)]),
        h('div', { class: 'card' }, h('h3', null, t('myGrades')), avg ? h('div', { class: 'score' }, avg) : null, avg && h('p', { class: 'muted small' }, t('avg')))),
      h('div', { class: 'card' }, h('h3', null, t('accuracy')), an.attempts.length ? topicBars(an.topics, keys) : empty(t('noData'))),
      h('div', { class: 'card' }, h('h3', null, t('myGrades')), grades.length ? h('div', { class: 'tablewrap' }, h('table', null, h('thead', null, h('tr', null, h('th', null, t('date')), h('th', null, t('kind')), h('th', { class: 'num' }, t('score')), h('th', null, t('note')))),
        h('tbody', null, grades.map((g) => h('tr', null, h('td', null, g.date), h('td', null, t(g.kind)), h('td', { class: 'num' }, h('span', { class: 'chip ' + (g.score >= 4 ? 'ok' : g.score === 3 ? 'warn' : 'bad') }, g.score)), h('td', null, g.note || '')))))) : empty(t('noGrades'))),
      h('div', { class: 'card' }, h('h3', null, t('lastAttempts')), attemptsTable(an.attempts)));
  };

  VIEWS.topic = async (view) => {
    const [topics, an] = await Promise.all([api('/api/topics'), api('/api/analytics/student?student=me')]);
    setView(view, h('h2', null, t('nav_topic')), h('p', { class: 'muted' }, t('topicTestIntro')),
      h('div', { class: 'grid' }, topics.map((x) => { const v = an.topics[x.topic]; return h('div', { class: 'card' }, h('h3', null, topicName(x.topic)), h('p', { class: 'muted small' }, x.n + ' ' + t('questionsWord')), v ? h('div', { class: 'bar ' + cls(v.pct), style: { marginBottom: '10px' } }, h('span', { style: { width: v.pct + '%' } })) : null, h('button', { class: 'btn', type: 'button', onclick: guard(() => startTest(view, { mode: 'topic', topic: x.topic, count: 10 })) }, t('start'))); })));
    if (st.pre) { const k = st.pre; st.pre = null; startTest(view, { mode: 'topic', topic: k, count: 10 }).catch((e) => toast(e.message, true)); }
  };
  VIEWS.exam = async (view) => {
    const e = st.exam;
    setView(view, h('h2', null, t('nav_exam')), h('div', { class: 'card' }, h('p', null, t('examIntro')), h('p', { class: 'chip' }, fmt(t('examRules'), { n: e.count, m: e.minutes, e: e.maxErrors })), h('p', null, h('button', { class: 'btn', type: 'button', onclick: guard(() => startTest(view, { mode: 'exam' })) }, t('start')))));
  };

  // ======== Test o'tkazuvchi ========
  async function startTest(view, req) {
    const data = await api('/api/test/start', 'POST', req);
    const answers = {}; let idx = 0; let left = data.limit_seconds; let done = false;
    const total = data.questions.length;
    const timerEl = h('span', { class: 'timer' });
    const submit = guard(async () => {
      if (done) return; done = true; clearInterval(st.timer);
      const r = await api('/api/test/submit', 'POST', { attempt_id: data.attempt_id, answers });
      showResult(view, data, answers, r);
    });
    const tick = () => { const m = String(Math.floor(left / 60)).padStart(2, '0'); const s = String(left % 60).padStart(2, '0'); timerEl.textContent = `${t('timeLeft')}: ${m}:${s}`; timerEl.classList.toggle('low', left <= 60); };
    if (data.limit_seconds) { tick(); st.timer = setInterval(() => { left -= 1; tick(); if (left <= 0) submit(); }, 1000); }
    const draw = () => {
      const q = data.questions[idx];
      const finishBtn = h('button', { class: 'btn', type: 'button', onclick: () => {
        const unanswered = total - Object.keys(answers).length;
        if (!unanswered) return submit();
        const yes = h('button', { class: 'btn danger small', type: 'button', onclick: submit }, t('yes')); const no = h('button', { class: 'btn ghost small', type: 'button', onclick: draw }, t('no'));
        box.replaceChildren(h('p', null, `${t('finishConfirm')} (${unanswered})`), h('div', { class: 'row' }, yes, no));
      } }, t('finish'));
      const box = h('div', { class: 'row' }, h('button', { class: 'btn ghost', type: 'button', disabled: idx === 0, onclick: () => { idx -= 1; draw(); } }, '←  ' + t('prev')), idx < total - 1 && h('button', { class: 'btn ghost', type: 'button', onclick: () => { idx += 1; draw(); } }, t('next') + '  →'), finishBtn);
      setView(view, h('div', { class: 'card' },
        h('div', { class: 'qhead' }, h('div', { class: 'muted' }, `${t('question')} ${idx + 1} ${t('of')} ${total} · ${topicName(q.topic)}`), data.limit_seconds ? timerEl : null),
        q.image && h('img', { class: 'qimg', src: q.image, alt: '' }), h('div', { class: 'qtext' }, qText(q.q)),
        qOpts(q.options).map((o, k) => h('button', { type: 'button', class: 'opt', 'aria-pressed': answers[q.id] === k, onclick: () => { answers[q.id] = k; draw(); } }, h('span', { class: 'k' }, String.fromCharCode(65 + k)), h('span', null, o))),
        box,
        h('div', { class: 'qnav' }, data.questions.map((x, i) => h('button', { type: 'button', class: (answers[x.id] !== undefined ? 'done ' : '') + (i === idx ? 'cur' : ''), onclick: () => { idx = i; draw(); } }, i + 1)))));
      if (data.limit_seconds) tick();
    };
    draw();
  }
  function showResult(view, data, answers, r) {
    const by = Object.fromEntries(r.details.map((d) => [d.id, d]));
    const exam = data.mode === 'exam';
    setView(view, h('div', { class: 'card' }, exam ? h('h2', { style: { color: r.passed ? 'var(--ok)' : 'var(--bad)' } }, r.passed ? '✓ ' + t('passed') : '✗ ' + t('failed')) : h('h2', null, t('result')),
      h('div', { class: 'score' }, `${r.correct} / ${r.total}`), h('p', { class: 'muted' }, `${t('correct')}: ${r.correct} · ${t('errors')}: ${r.errors}`), r.late && h('p', { class: 'chip warn' }, t('lateNote')),
      h('div', { class: 'qnav' }, data.questions.map((q, i) => h('button', { type: 'button', class: by[q.id]?.ok ? 'right' : 'wrong', onclick: () => document.getElementById('rq' + i)?.scrollIntoView({ block: 'center' }) }, i + 1)))),
    h('h3', null, t('review')),
    data.questions.map((q, i) => { const d = by[q.id]; return h('div', { class: 'card', id: 'rq' + i }, h('div', { class: 'small muted' }, `${i + 1}. ${topicName(q.topic)}`), q.image && h('img', { class: 'qimg', src: q.image, alt: '' }), h('div', { class: 'qtext' }, qText(q.q)),
      qOpts(q.options).map((o, k) => h('div', { class: 'opt' + (k === d.correct ? ' right' : k === d.chosen ? ' wrong' : '') }, h('span', { class: 'k' }, String.fromCharCode(65 + k)), h('span', null, o))), d.chosen === -1 && h('p', { class: 'chip warn' }, t('noAnswer'))); }));
    window.scrollTo(0, 0);
  }

  render();
})();
