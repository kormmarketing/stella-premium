import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// ─── Контентные данные (легко заменяемые) ─────────────────────────────────
const IMAGES = {
  hero: '/hero.png',
  project: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
  manager: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  production: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200',
};

// Блок «Сначала проект» — scroll-driven этапы
const PROJECT_STEPS = [
  { number: '01', title: 'Обсуждение задачи', image: '/step-01-discussion.png' },
  { number: '02', title: 'Планировка и компоновка', image: '/step-02-planning.png' },
  { number: '03', title: 'Оформление и детали', image: '/step-03-design.png' },
  { number: '04', title: 'Итоговый проект', image: '/step-04-final.png' },
];

const PROJECT_IMAGES = [
  '/project-01.png', '/project-02.png', '/project-03.png', '/project-04.png', '/project-05.png',
  '/project-06.png', '/project-07.png', '/project-08.png', '/project-09.png', '/project-10.png',
];

const PROJECT_MOCKUPS = [
  '/project-01.png', '/project-02.png', '/project-03.png', '/project-04.png', '/project-05.png',
  '/project-06.png', '/project-07.png', '/project-08.png', '/project-09.png', '/project-10.png',
];

const PROJECTS_CASES = [
  { title: 'Мемориальный комплекс с колоннадой', stone: 'Габбро-диабаз, белый мрамор', region: 'Московская область', description: 'Классическая колоннада с полукруглой аркой и центральным монументом.', mockupImage: '/project-01-mockup.png' },
  { title: 'Павильон с прозрачной кровлей', stone: 'Габбро-диабаз, белый мрамор', region: 'Московская область', description: 'Современный павильон с остеклённой кровлей и колоннами.', mockupImage: '/project-02-mockup.png' },
  { title: 'Комплекс в стиле павильона', stone: 'Тан Браун, чёрный гранит', region: 'Московская область', description: 'Неоклассический павильон с ортодоксальным крестом и мраморными колоннами.', mockupImage: '/project-03-mockup.png' },
  { title: 'Мемориал с перголой и ангелом', stone: 'Габбро-диабаз', region: 'Московская область', description: 'Четырёхколонная конструкция с мраморной скульптурой ангела.', mockupImage: '/project-04-mockup.png' },
  { title: 'Беседка из полированного гранита', stone: 'Габбро-диабаз', region: 'Московская область', description: 'Классическая беседка с цилиндрическими колоннами и изящными стелами.', mockupImage: '/project-05-mockup.png' },
  { title: 'Храмовый комплекс с фронтоном', stone: 'Габбро-диабаз', region: 'Московская область', description: 'Монументальный храмовый стиль с греческим орнаментом и центральным крестом.', mockupImage: '/project-06-mockup.png' },
  { title: 'Трёхарковый неоклассический комплекс', stone: 'Империал Ред, габбро-диабаз', region: 'Московская область', description: 'Симметричная композиция с центральной аркой и боковыми портиками.', mockupImage: '/project-07-mockup.png' },
  { title: 'Комплекс с колоннадой и крестом', stone: 'Балтик Браун, габбро-диабаз', region: 'Московская область', description: 'Полукруглая колоннада с центральной аркой и золотым крестом.', mockupImage: '/project-08-mockup.png' },
  { title: 'Павильон с витыми колоннами', stone: 'Империал Ред, габбро-диабаз', region: 'Московская область', description: 'Неоклассический павильон с декоративными спиральными колоннами.', mockupImage: '/project-09-mockup.png' },
  { title: 'Мемориальный комплекс', stone: 'Габбро-диабаз', region: 'Москва', description: 'Комплекс разработан с учётом участка и пропорций для аккуратного внешнего вида.' },
];

const MATERIALS = [
  { id: 'gabbro', title: 'Габбро-Диабаз', subtitle: 'чёрный, равномерный, мелкозернистый, Карелия, Россия', image: '/material-gabbro-dark.png' },
  { id: 'vinga', title: 'Винга', subtitle: 'красно-розовый, среднезернистый, Россия', image: '/material-imperial-red.png' },
  { id: 'dymovsky', title: 'Дымовский', subtitle: 'коричнево-красный, крупнозернистый, Россия', image: '/material-tan-brown.png' },
  { id: 'aurora', title: 'Аврора', subtitle: 'коричнево-красный с тёмными включениями, Финляндия', image: '/material-paradiso.png' },
  { id: 'tsvetok-urala', title: 'Цветок Урала', subtitle: 'серо-розовый, среднезернистый, Россия', image: '/material-imperial-black.png' },
  { id: 'leznikovsky', title: 'Лезниковский', subtitle: 'красный, насыщенный, крупнозернистый, Украина', image: '/material-olive-green.png' },
  { id: 'baltik-green', title: 'Балтик Грин', subtitle: 'зелёный с чёрными пятнами, Финляндия', image: '/material-blue-pearl.png' },
  { id: 'amphibolit', title: 'Амфиболит', subtitle: 'тёмно-зелёный, почти чёрный, плотный, Россия', image: '/material-kapustinsky.png' },
  { id: 'baltik-blue', title: 'Балтик Блю', subtitle: 'тёмный с синими переливами, Норвегия', image: '/material-light-grey.png' },
  { id: 'mansurovsky', title: 'Мансуровский', subtitle: 'светло-серый, равномерный, Россия', image: '/material-mansurovsky.png' },
  { id: 'shansi-black', title: 'Шанси Блэк', subtitle: 'чёрный, однородный, мелкозернистый, Китай', image: '/material-gabbro-dark.png' },
  { id: 'nero-afrika', title: 'Неро Африка', subtitle: 'чёрный с серыми вкраплениями, ЮАР', image: '/material-imperial-black.png' },
  { id: 'ever-green', title: 'Эвер Грин', subtitle: 'тёмно-зелёный, плотный, Китай', image: '/material-olive-green.png' },
  { id: 'g439', title: 'G-439', subtitle: 'серый, мелкозернистый, Китай', image: '/material-light-grey.png' },
  { id: 'g623', title: 'G-623', subtitle: 'светло-серый, равномерный, Китай', image: '/material-mansurovsky.png' },
  { id: 'zhezhelevsky', title: 'Жежелевский', subtitle: 'серо-коричневый, крупнозернистый, Украина', image: '/material-tan-brown.png' },
  { id: 'lisya-gorka', title: 'Лисья Горка', subtitle: 'серый, плотный, Россия', image: '/material-light-grey.png' },
  { id: 'multicolor-red', title: 'Мультиколор Рэд', subtitle: 'красный с чёрными прожилками, Индия', image: '/material-imperial-red.png' },
  { id: 'kalguvara', title: 'Калгувара', subtitle: 'красный с волнистым рисунком, Россия', image: '/material-kapustinsky.png' },
  { id: 'tokovsky', title: 'Токовский', subtitle: 'коричнево-красный, Украина', image: '/material-tan-brown.png' },
  { id: 'black-cosmic', title: 'Блэк Космик', subtitle: 'чёрный с золотистыми прожилками, Бразилия', image: '/material-imperial-black.png' },
  { id: 'nero-markino', title: 'Неро Маркино', subtitle: 'чёрный с белыми прожилками, Испания', image: '/material-imperial-black.png' },
  { id: 'green-tinos', title: 'Грин Тинос', subtitle: 'зелёный с белыми прожилками, Греция', image: '/material-olive-green.png' },
  { id: 'butterfly-green', title: 'Батерфляй Грин', subtitle: 'зелёный с чёрными узорами, Китай', image: '/material-olive-green.png' },
  { id: 'carmen-red', title: 'Кармэн Рэд', subtitle: 'красный, равномерный, Финляндия', image: '/material-imperial-red.png' },
  { id: 'azul-bahia', title: 'Азул Бахия', subtitle: 'синий с яркими прожилками, Бразилия', image: '/material-blue-pearl.png' },
  { id: 'kurtinsky', title: 'Куртинский', subtitle: 'коричневый, зернистый, Казахстан', image: '/material-tan-brown.png' },
  { id: 'pj-black', title: 'Пи Джи Блэк', subtitle: 'чёрный, глубокий, Финляндия', image: '/material-gabbro-dark.png' },
  { id: 'polotsky', title: 'Полоцкий', subtitle: 'серо-бежевый, плотный, Россия', image: '/material-light-grey.png' },
  { id: 'tropical-green', title: 'Тропикал Грин', subtitle: 'зелёный с хаотичным рисунком, Индия', image: '/material-olive-green.png' },
  { id: 'g633', title: 'G-633', subtitle: 'серый, универсальный, Китай', image: '/material-light-grey.png' },
  { id: 'g636', title: 'G-636', subtitle: 'серый, равномерный, Китай', image: '/material-mansurovsky.png' },
  { id: 'vozrozhdenie', title: 'Возрождение', subtitle: 'серый с тёмными вкраплениями, Россия', image: '/material-light-grey.png' },
  { id: 'kurdaysky', title: 'Курдайский', subtitle: 'красно-коричневый, Казахстан', image: '/material-tan-brown.png' },
  { id: 'tokimovsky', title: 'Токимовский', subtitle: 'тёмно-коричневый, Россия', image: '/material-tan-brown.png' },
  { id: 'kashina-gora', title: 'Кашина Гора', subtitle: 'серо-коричневый, Россия', image: '/material-tan-brown.png' },
  { id: 'cafe-imperial', title: 'Кафе Империал', subtitle: 'коричневый с чёрными вкраплениями, Индия', image: '/material-tan-brown.png' },
  { id: 'pokostovsky', title: 'Покостовский', subtitle: 'серый с чёрными точками, Украина', image: '/material-light-grey.png' },
  { id: 'padang-dark', title: 'Паданг Дарк', subtitle: 'тёмно-серый, Китай', image: '/material-imperial-black.png' },
  { id: 'kapustinsky', title: 'Капустинский', subtitle: 'красный, крупнозернистый, Украина', image: '/material-kapustinsky.png' },
  { id: 'shoksha', title: 'Шокша', subtitle: 'малиново-красный, плотный, Карелия, Россия', image: '/material-imperial-red.png' },
  { id: 'amadeus', title: 'Амадеус', subtitle: 'сине-серый, мелкозернистый, Финляндия', image: '/material-blue-pearl.png' },
  { id: 'bahama-blue', title: 'Багама Блю', subtitle: 'синий с серыми прожилками, Индия', image: '/material-blue-pearl.png' },
  { id: 'elizovsky', title: 'Елизовский', subtitle: 'коричневый, равномерный, Россия', image: '/material-tan-brown.png' },
  { id: 'paradiso-klassik', title: 'Парадизо Классик', subtitle: 'серо-коричневый с волнами, Индия', image: '/material-paradiso.png' },
  { id: 'gabbro-ukr', title: 'Габбро', subtitle: 'чёрный, плотный, Украина', image: '/material-gabbro-dark.png' },
  { id: 'green-galaxy', title: 'Грин Гэлакси', subtitle: 'зелёный с блеском, Китай', image: '/material-olive-green.png' },
  { id: 'emerald-pearl', title: 'Эмеральд Пёрл', subtitle: 'тёмно-зелёный с переливами, Норвегия', image: '/material-olive-green.png' },
  { id: 'ufaley', title: 'Уфалей', subtitle: 'светло-серый, Россия', image: '/material-mansurovsky.png' },
  { id: 'silver-pearl', title: 'Сильвер Пёрл', subtitle: 'серый с металлическим блеском, Норвегия', image: '/material-light-grey.png' },
  { id: 'steel-gray', title: 'Стил Грэй', subtitle: 'серый, строгий, Индия', image: '/material-light-grey.png' },
  { id: 'maple-red', title: 'Мапл Рэд', subtitle: 'красный с мелким зерном, Китай', image: '/material-imperial-red.png' },
  { id: 'volga-blue', title: 'Волга Блю', subtitle: 'тёмный с голубыми кристаллами, Украина', image: '/material-blue-pearl.png' },
  { id: 'absolut-black', title: 'Абсолют Блэк', subtitle: 'чёрный, максимально однородный, Индия', image: '/material-gabbro-dark.png' },
  { id: 'zmeevik-grigoryevsky', title: 'Змеевик Григорьевский', subtitle: 'зелёный с прожилками, Россия', image: '/material-olive-green.png' },
  { id: 'tan-brown', title: 'Тан Браун', subtitle: 'коричневый с чёрными вкраплениями, Индия', image: '/material-tan-brown.png' },
  { id: 'maslovsky', title: 'Масловский', subtitle: 'зелёный, Украина', image: '/material-olive-green.png' },
  { id: 'sibirsky', title: 'Сибирский', subtitle: 'серый, плотный, Россия', image: '/material-light-grey.png' },
  { id: 'syskyuyansaaari', title: 'Сюскюянсаари', subtitle: 'красный, Карелия, Россия', image: '/material-imperial-red.png' },
  { id: 'kashmir-white', title: 'Кашмир Уайт', subtitle: 'бело-серый с прожилками, Индия', image: '/material-mansurovsky.png' },
  { id: 'yunnan-green', title: 'Юньнань Грин', subtitle: 'тёмно-зелёный, Китай', image: '/material-olive-green.png' },
  { id: 'blue-pearl', title: 'Блю Пёрл', subtitle: 'синий с переливами, Норвегия', image: '/material-blue-pearl.png' },
  { id: 'kuru-gray', title: 'Куру Грэй', subtitle: 'серый, Финляндия', image: '/material-light-grey.png' },
  { id: 'rombak', title: 'Ромбак', subtitle: 'чёрный, плотный, Россия', image: '/material-gabbro-dark.png' },
  { id: 'blue-antique', title: 'Блю Антик', subtitle: 'коричнево-синий, Норвегия', image: '/material-blue-pearl.png' },
  { id: 'imperial-red', title: 'Империал Рэд', subtitle: 'красный, насыщенный, Индия', image: '/material-imperial-red.png' },
  { id: 'black-galaxy', title: 'Блэк Гэлакси', subtitle: 'чёрный с золотыми вкраплениями, Индия', image: '/material-imperial-black.png' },
  { id: 'masi-kvartcit', title: 'Маси Кварцит', subtitle: 'зелёный с текстурой, Норвегия', image: '/material-olive-green.png' },
  { id: 'oliv-green', title: 'Олив Грин', subtitle: 'зелёный, однородный, Индия', image: '/material-olive-green.png' },
  { id: 'royal-white', title: 'Роял Уайт', subtitle: 'светло-серый, Китай', image: '/material-mansurovsky.png' },
];

const PHONE = '+7 900 123-45-67';
const CONTACTS = {
  whatsapp: `https://wa.me/${PHONE.replace(/\D/g, '')}`,
  telegram: 'https://t.me/stellapremium',
  phone: `tel:${PHONE.replace(/\s/g, '')}`,
  email: 'info@stellapremium.ru',
  office: 'Москва, ул. Миклухо-Маклая, 53к1',
  production: 'Серпухов, ул. Базовая, 7',
  mapUrl: 'https://yandex.ru/map-widget/v1/?ll=37.455,55.279&pt=37.506,55.649~37.404,54.909&z=9&l=map',
};

// ─── Анимация секции ─────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────
function Header() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 100], ['rgba(15,15,16,0)', 'rgba(15,15,16,0.96)']);
  const blur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(12px)']);

  return (
    <motion.header
      style={{ backgroundColor: bg, backdropFilter: blur, WebkitBackdropFilter: blur }}
      className="fixed top-0 left-0 right-0 z-50 py-5 px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-content mx-auto flex justify-between items-center">
        <a href="/" className="font-body text-text-main text-[15px] font-light tracking-wide hover:text-text-muted transition-colors duration-300">
          StellaPremium
        </a>
        <div className="flex items-center gap-8">
          <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="text-text-muted text-sm font-light hover:text-text-main transition-colors hidden sm:block">
            {PHONE}
          </a>
          <a
            href="#consult"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-white text-text-main text-sm font-light hover:bg-white hover:border-white group transition-all duration-300"
          >
            <span className="group-hover:text-[#0F0F10] transition-colors duration-300">Связаться</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}

// ─── 1. Hero ─────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const opacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.35], [1, 1.02]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-end lg:justify-center overflow-hidden" style={{ backgroundColor: '#0F0F10' }}>
      {/* Изображение: сдвинуто вправо, правая часть может обрезаться */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[22%_50%]"
        />
        {/* Фон под текстом с прозрачностью; картинка правее */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(15,15,16,0.92) 0%, rgba(15,15,16,0.86) 44%, rgba(15,15,16,0.55) 52%, rgba(15,15,16,0.18) 62%, transparent 72%)',
          }}
        />
        <div className="absolute inset-0 bg-black/18" />
      </motion.div>

      {/* Контент */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 px-6 md:px-12 lg:px-16 pb-20 lg:pb-32 pt-[140px] lg:pt-0 max-w-content"
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-hero font-medium text-text-main tracking-[0.02em] max-w-2xl mb-4"
        >
          <span className="uppercase tracking-wider">Мемориальные комплексы из гранита</span>
          <span className="block font-light tracking-[-0.01em] text-lead mt-4 normal-case">с индивидуальным проектом и установкой под ключ</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
          className="text-body text-text-muted/80 font-light max-w-lg mb-10"
        >
          Полный цикл работ: проект, производство и установка. Персональный менеджер ведёт проект до результата.
        </motion.p>

        <motion.a
          href="#consult"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="inline-flex items-center justify-center gap-2 min-w-[440px] px-20 py-4 border border-white text-text-main text-sm font-light tracking-wide transition-colors duration-150 group hover:bg-white hover:border-white"
        >
          <span className="group-hover:text-[#0F0F10] transition-colors duration-150">Получить расчёт проекта</span>
          <span className="text-text-muted group-hover:text-[#0F0F10] transition-colors duration-150">→</span>
        </motion.a>
      </motion.div>
    </section>
  );
}

// ─── 2. Смысловой блок — premium process section ───────────────────────────
const PROCESS_STEPS = [
  'Выезд и замеры на месте',
  'Проект и согласование деталей',
  'Подбор материалов и решений',
  'Изготовление и контроль качества',
  'Установка и оформление документов',
];

const PROCESS_STEP_DETAILS = [
  {
    title: 'Выезд и замеры на месте',
    subtitle: 'Работа начинается с понимания участка и его особенностей.',
    text: 'Мы выезжаем на место, оцениваем размеры, расположение, окружение и технические условия установки. Это позволяет сразу принимать решения не абстрактно, а с учётом реального участка.',
    points: [
      'анализ размеров и особенностей участка',
      'оценка условий для установки',
      'фиксация исходных параметров',
      'основа для дальнейшего проекта',
    ],
  },
  {
    title: 'Проект и согласование деталей',
    subtitle: 'До начала работ формируется понятная и согласованная концепция.',
    text: 'Мы прорабатываем внешний вид комплекса, его состав и детали, чтобы все ключевые решения были приняты заранее. Это снимает неопределённость и помогает избежать случайных решений в процессе.',
    points: [
      'общая концепция комплекса',
      'согласование состава и деталей',
      'предварительное понимание результата',
      'единая логика проекта',
    ],
  },
  {
    title: 'Подбор материалов и решений',
    subtitle: 'Материалы подбираются не отдельно, а под общий образ проекта.',
    text: 'Мы подбираем камень, фактуры и решения с учётом визуального характера комплекса, бюджета и практических задач. Важно, чтобы материал работал на общий образ и сохранял качество со временем.',
    points: [
      'подбор камня под задачу проекта',
      'сочетание внешнего вида и практичности',
      'выбор материалов под бюджет и стиль',
      'целостность визуального решения',
    ],
  },
  {
    title: 'Изготовление и контроль качества',
    subtitle: 'Проект переходит в производство под контролем каждого этапа.',
    text: 'После согласования решений комплекс изготавливается на собственном производстве. Мы контролируем обработку, соответствие проекту и качество исполнения, чтобы итоговый результат соответствовал ожиданиям.',
    points: [
      'изготовление по согласованному проекту',
      'контроль обработки и деталей',
      'соблюдение качества на всех этапах',
      'точность реализации',
    ],
  },
  {
    title: 'Установка и оформление документов',
    subtitle: 'Финальный этап включает не только монтаж, но и организационное сопровождение.',
    text: 'Мы сопровождаем установку комплекса и берём на себя документальную часть, связанную с её оформлением. Заказчик получает не просто изделие, а завершённый результат без лишней нагрузки на себя.',
    points: [
      'организация установки',
      'сопровождение по документам',
      'координация финального этапа',
      'завершённый результат под ключ',
    ],
  },
];

const processStepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.2 + i * 0.14,
    },
  }),
};

function ProcessStepCard({ step, index, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={() => onClick?.(index)}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={processStepVariants}
      whileHover={{
        y: -3,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      className="group relative w-full text-left overflow-hidden rounded-2xl border border-[#2A2A2D] bg-[#131416] transition-[border-color,background-color] duration-300 hover:border-[#3a3a3e] hover:bg-[#16171A] cursor-pointer"
    >
      <div className="relative flex items-center gap-8 md:gap-12 lg:gap-16 px-6 md:px-8 lg:px-10 py-5 md:py-6 min-h-[72px] md:min-h-[84px]">
        {/* Номер этапа — крупный serif, полупрозрачный */}
        <span
          className="font-heading font-light tabular-nums shrink-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
            color: '#EAEAEA',
            opacity: 0.35,
            letterSpacing: '-0.02em',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Название этапа */}
        <span className="flex-1 font-body text-[clamp(1.125rem, 1.25vw, 1.25rem)] font-light text-[#EAEAEA] tracking-wide leading-snug">
          {step}
        </span>

        {/* Деликатная стрелка справа */}
        <span className="hidden sm:flex shrink-0 text-[#9A9A9A] text-xl transition-all duration-300 group-hover:text-[#EAEAEA] group-hover:translate-x-1.5">
          →
        </span>
      </div>

      {/* Мягкий radial highlight при hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 70% 50%, rgba(42,42,45,0.15) 0%, transparent 70%)',
        }}
        aria-hidden
      />
    </motion.button>
  );
}

function ProcessModal({ stepIndex, onClose }) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, [stepIndex]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (stepIndex == null) return null;
  const detail = PROCESS_STEP_DETAILS[stepIndex];
  if (!detail) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="process-modal-title"
      ref={modalRef}
      initial={{ opacity: 0, scale: 0.98, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-[100] w-full max-w-lg mx-4 sm:mx-6 max-h-[90vh] overflow-hidden rounded-[24px] border border-[#2A2A2D] shadow-2xl"
      style={{ backgroundColor: '#111214' }}
    >
      {/* Деликатная декоративная линия */}
      <div
        className="absolute top-0 right-0 w-24 h-px opacity-30"
        style={{ background: 'linear-gradient(90deg, transparent, #3a3a3e)' }}
        aria-hidden
      />

      <div className="overflow-y-auto max-h-[90vh] p-6 sm:p-8 md:p-10">
        {/* Номер этапа */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-heading font-light tabular-nums"
            style={{ fontSize: '0.9375rem', color: '#9A9A9A', letterSpacing: '0.05em' }}
          >
            {String(stepIndex + 1).padStart(2, '0')}
          </span>
          <span
            className="text-[0.75rem] uppercase tracking-[0.18em]"
            style={{ color: '#6a6a6e' }}
          >
            Этап проекта
          </span>
        </div>

        <h3
          id="process-modal-title"
          className="font-heading font-medium tracking-[-0.01em] mb-3"
          style={{
            fontSize: 'clamp(1.5rem, 2.2vw, 1.875rem)',
            lineHeight: 1.2,
            color: '#EAEAEA',
          }}
        >
          {detail.title}
        </h3>
        <p
          className="font-body font-light mb-6"
          style={{ fontSize: '1rem', color: '#A9A9AD', lineHeight: 1.5 }}
        >
          {detail.subtitle}
        </p>
        <p
          className="font-body font-light mb-8"
          style={{ fontSize: '1rem', color: '#A9A9AD', lineHeight: 1.65 }}
        >
          {detail.text}
        </p>
        <ul className="space-y-3">
          {detail.points.map((point, i) => (
            <li key={i} className="flex items-start gap-3 font-body font-light" style={{ fontSize: '0.9375rem', color: '#A9A9AD', lineHeight: 1.5 }}>
              <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#3a3a3e' }} />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer линия */}
      <div className="h-px" style={{ backgroundColor: '#2A2A2D' }} />

      {/* Кнопка закрытия */}
      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute top-5 right-5 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full border border-[#2A2A2D] text-[#A9A9AD] hover:bg-[#1a1a1c] hover:border-[#3a3a3e] hover:text-[#EAEAEA] transition-colors duration-300"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 2l10 10M12 2L2 12" />
        </svg>
      </button>
    </motion.div>
  );
}

function BlockMeaning() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [activeStep, setActiveStep] = useState(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-[clamp(6rem,12vh,9rem)] px-6 md:px-12 lg:px-20 overflow-hidden"
      style={{ backgroundColor: '#0F0F10' }}
    >
      <div className="max-w-[1520px] mx-auto">
        {/* Текстовая часть — слева/сверху */}
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-16 lg:gap-24 items-start mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="lg:sticky lg:top-[140px] lg:-mt-16"
          >
            <span
              className="inline-block font-body text-[0.8125rem] uppercase tracking-[0.2em] mb-2"
              style={{ color: '#9A9A9A' }}
            >
              Процесс
            </span>
            <h2
              className="font-heading font-medium tracking-[-0.02em] mb-6"
              style={{
                fontSize: 'clamp(2.25rem, 3.5vw, 3.25rem)',
                lineHeight: 1.12,
                color: '#EAEAEA',
              }}
            >
              Работаем с проектом, а не с отдельным изделием
            </h2>
            <div
              className="font-body font-light leading-relaxed max-w-lg space-y-12 text-right ml-auto mt-24"
              style={{
                fontSize: 'clamp(1.0625rem, 1.2vw, 1.25rem)',
                color: '#9A9A9A',
              }}
            >
              <p>Мы не просто изготавливаем памятник.<br />Мы ведём весь проект — от участка до установки.</p>
              <p>Берём на себя подбор материалов, разработку внешнего вида, технические решения и оформление документов.</p>
              <p>Вы понимаете, как будет выглядеть результат ещё до начала работ и не погружаетесь в сложные детали процесса.</p>
            </div>
          </motion.div>

          {/* Step cards */}
          <div className="flex flex-col gap-3 md:gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <ProcessStepCard key={i} step={step} index={i} onClick={setActiveStep} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal — рендер в body через portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeStep != null && (
            <motion.div
              key={`process-modal-${activeStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
            >
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setActiveStep(null)}
                aria-hidden
              />
              <div
                className="relative z-10 flex items-center justify-center w-full min-h-0"
                onClick={(e) => e.stopPropagation()}
              >
                <ProcessModal stepIndex={activeStep} onClose={() => setActiveStep(null)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

// ─── 3. Проект — scroll-driven sticky секция ─────────────────────────────────
function BlockProject() {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const steps = [0.2, 0.45, 0.7];
    let step = 0;
    if (v >= steps[2]) step = 3;
    else if (v >= steps[1]) step = 2;
    else if (v >= steps[0]) step = 1;
    setActiveStep(step);
  });

  const activeData = PROJECT_STEPS[activeStep];

  return (
    <section
      ref={sectionRef}
      className="relative px-6 md:px-12 lg:px-20"
      style={{ backgroundColor: '#0F0F10', height: '300vh' }}
    >
      <div
        className="sticky top-0 min-h-screen flex items-center py-20 lg:py-28"
        style={{ paddingTop: 'clamp(5rem, 10vh, 7rem)' }}
      >
        <div className="max-w-[1520px] mx-auto w-full">
          <div className="grid lg:grid-cols-[0.4fr_1fr] gap-16 lg:gap-24 items-start">
            {/* Левая колонка — текст и этапы */}
            <div className="lg:max-w-md order-2 lg:order-1">
              <span
                className="inline-block font-body text-[0.8125rem] uppercase tracking-[0.2em] mb-2"
                style={{ color: '#9A9A9A' }}
              >
                Проект
              </span>
              <h2
                className="font-heading font-medium tracking-[-0.02em] mb-6"
                style={{
                  fontSize: 'clamp(2rem, 2.8vw, 2.75rem)',
                  lineHeight: 1.12,
                  color: '#EAEAEA',
                }}
              >
                Сначала проект — потом изготовление
              </h2>

              <p
                className="font-body font-light leading-relaxed mb-12"
                style={{
                  fontSize: 'clamp(1rem, 1.1vw, 1.125rem)',
                  color: '#9A9A9A',
                }}
              >
                До начала работ вы понимаете, как будет выглядеть комплекс и что входит в состав.
              </p>

              {/* Список этапов — scroll-driven */}
              <div className="space-y-3">
                {PROJECT_STEPS.map((step, i) => {
                  const isActive = activeStep === i;
                  return (
                    <motion.div
                      key={step.number}
                      animate={{
                        opacity: isActive ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="relative flex items-center gap-5 py-5 pl-6 border-l-2 transition-colors duration-400"
                      style={{
                        marginLeft: '-1px',
                        borderLeftColor: isActive ? 'rgba(234,234,234,0.5)' : '#2A2A2D',
                      }}
                    >
                      <span
                        className="font-heading text-[0.9375rem] tabular-nums shrink-0 transition-colors duration-400"
                        style={{ color: isActive ? '#EAEAEA' : '#6A6A6E' }}
                      >
                        {step.number}
                      </span>
                      <span
                        className="font-body font-light text-[1.125rem] tracking-wide transition-colors duration-400"
                        style={{ color: isActive ? '#EAEAEA' : '#6A6A6E' }}
                      >
                        {step.title}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <p
                className="font-body font-light leading-relaxed mt-10"
                style={{
                  fontSize: 'clamp(1.0625rem, 1.2vw, 1.1875rem)',
                  color: '#C8C8CA',
                }}
              >
                Вы можете заказать только услугу создания проекта. А изготовителя выбрать самостоятельно.
              </p>

              <a
                href="#consult"
                className="flex items-center justify-center gap-2 mt-6 w-full px-10 py-3.5 border border-white text-[#EAEAEA] text-sm font-light tracking-wide hover:bg-white hover:border-white group transition-all duration-300"
              >
                <span className="group-hover:text-[#0F0F10] transition-colors duration-300">Заказать проект</span>
                <span className="text-[#9A9A9A] group-hover:text-[#0F0F10] transition-colors duration-300">→</span>
              </a>
            </div>

            {/* Правая колонка — изображение этапа */}
            <div className="relative order-1 lg:order-2 w-full aspect-[4/3] lg:aspect-[6/5] max-w-none lg:min-h-[420px] overflow-hidden rounded-2xl border border-[#2A2A2D]">
              <div
                className="absolute -inset-px rounded-2xl pointer-events-none opacity-40"
                style={{ boxShadow: '0 0 60px -20px rgba(0,0,0,0.5)' }}
                aria-hidden
              />

              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeData.image}
                    src={activeData.image}
                    alt={activeData.title}
                    initial={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 w-full h-full object-contain object-center bg-[#0a0a0b]"
                  />
                </AnimatePresence>
              </div>

              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: `
                    linear-gradient(to top, rgba(15,15,16,0.85) 0%, transparent 45%),
                    linear-gradient(to right, rgba(15,15,16,0.25) 0%, transparent 15%, transparent 85%, rgba(15,15,16,0.25) 100%)
                  `,
                }}
                aria-hidden
              />

              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-2xl"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: '32px 32px',
                }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. Проекты — премиальный слайдер-галерея ─────────────────────────────
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 80 : -80, opacity: 0 }),
};

function BlockProjects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  const total = PROJECTS_CASES.length;
  const goNext = () => {
    setDirection(1);
    setSlideIndex((i) => (i + 1) % total);
  };
  const goPrev = () => {
    setDirection(-1);
    setSlideIndex((i) => (i - 1 + total) % total);
  };

  const handleDragEnd = (_, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold) goNext();
    else if (info.offset.x > threshold) goPrev();
  };

  const project = PROJECTS_CASES[slideIndex];
  const resultImage = project.resultImage ?? PROJECT_IMAGES[slideIndex % PROJECT_IMAGES.length];
  const mockupImage = project.mockupImage ?? PROJECT_MOCKUPS[slideIndex % PROJECT_MOCKUPS.length];

  return (
    <section
      ref={sectionRef}
      className="relative py-[clamp(6rem,12vh,9rem)] px-6 md:px-12 lg:px-20 overflow-hidden"
      style={{ backgroundColor: '#0F0F10' }}
    >
      <div className="max-w-[1520px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 lg:mb-16"
        >
          <div>
            <span
              className="inline-block font-body text-[0.8125rem] uppercase tracking-[0.2em] mb-2"
              style={{ color: '#9A9A9A' }}
            >
              Портфолио
            </span>
            <h2
              className="font-heading font-medium tracking-[-0.02em] mb-3"
              style={{
                fontSize: 'clamp(2rem, 2.8vw, 2.75rem)',
                color: '#EAEAEA',
              }}
            >
              Примеры проектов
            </h2>
            <p
              className="font-body font-light max-w-lg"
              style={{ fontSize: '1.0625rem', color: '#9A9A9A' }}
            >
              Каждый комплекс разрабатывается под участок и задачу семьи
            </p>
          </div>

          {/* Навигация */}
          <div className="flex items-center gap-6">
            <span
              className="font-heading text-[0.9375rem] tabular-nums"
              style={{ color: '#6B6B6B' }}
            >
              {String(slideIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-[#2A2A2D] text-[#9A9A9A] hover:border-[#3a3a3e] hover:text-[#EAEAEA] transition-colors duration-300"
                aria-label="Предыдущий"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goNext}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-[#2A2A2D] text-[#9A9A9A] hover:border-[#3a3a3e] hover:text-[#EAEAEA] transition-colors duration-300"
                aria-label="Следующий"
              >
                →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Слайдер */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="relative cursor-grab active:cursor-grabbing"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={slideIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch min-h-[500px] lg:min-h-[560px]"
            >
              {/* Левая часть — информация + макет */}
              <div className="flex flex-col gap-8 order-2 lg:order-1">
                <div className="flex flex-col gap-4">
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="font-body font-light text-[1rem] leading-relaxed"
                    style={{ color: '#9A9A9A' }}
                  >
                    {project.title}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="font-body font-light text-[1rem]"
                    style={{ color: '#9A9A9A' }}
                  >
                    {project.stone} · {project.region}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="font-body font-light text-[1rem] leading-relaxed max-w-md"
                    style={{ color: '#9A9A9A' }}
                  >
                    {project.description}
                  </motion.p>
                </div>

                {/* Макет */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setLightboxImage(mockupImage)}
                  onKeyDown={(e) => e.key === 'Enter' && setLightboxImage(mockupImage)}
                  className="flex-1 min-h-[240px] overflow-hidden rounded-2xl border border-[#2A2A2D] group/mockup cursor-pointer"
                >
                  <img
                    src={mockupImage}
                    alt="Макет проекта"
                    className="w-full h-full object-contain object-center bg-[#0a0a0b] transition-transform duration-500 group-hover/mockup:scale-[1.02]"
                  />
                </motion.div>
              </div>

              {/* Правая часть — результат */}
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                role="button"
                tabIndex={0}
                onClick={() => setLightboxImage(resultImage)}
                onKeyDown={(e) => e.key === 'Enter' && setLightboxImage(resultImage)}
                className="relative order-1 lg:order-2 overflow-hidden rounded-[20px] border border-[#2A2A2D] group/result min-h-[320px] lg:min-h-full cursor-pointer"
              >
                <img
                  src={resultImage}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover/result:scale-[1.03]"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Лайтбокс при клике на фото */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/90"
              onClick={() => setLightboxImage(null)}
            >
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white text-2xl"
                aria-label="Закрыть"
              >
                ×
              </button>
              <motion.img
                src={lightboxImage}
                alt=""
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

// ─── 6. Производство ─────────────────────────────────────────────────────
const PRODUCTION_ACCENTS = [
  'Современное оборудование',
  'Большой склад с ассортиментом натурального камня',
  'Контроль качества на каждом этапе изготовления',
  'Изготовление строго по согласованному проекту',
];

const RUTUBE_VIDEO_ID = 'cb8d4c9ff93b15bdd92ad1ae316ba511';

function BlockProduction() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [hoveredLine, setHoveredLine] = useState(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const videoScale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [1.05, 1, 1.02]);

  return (
    <section
      ref={sectionRef}
      className="relative py-[clamp(6rem,12vh,9rem)] px-6 md:px-12 lg:px-20 overflow-hidden"
      style={{ backgroundColor: '#111214' }}
    >
      <div className="max-w-[1520px] mx-auto group/production">
        <div className="grid lg:grid-cols-[0.4fr_1fr] gap-16 lg:gap-24 items-end">
          {/* Текст */}
          <div className="lg:max-w-md">
            <span
              className="inline-block font-body text-[0.8125rem] uppercase tracking-[0.2em] mb-2"
              style={{ color: '#9A9A9A' }}
            >
              Производство
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-medium tracking-[-0.02em] mb-4"
              style={{
                fontSize: 'clamp(2rem, 2.8vw, 2.75rem)',
                lineHeight: 1.12,
                color: '#EAEAEA',
              }}
            >
              Собственное производство
            </motion.h2>
            <div className="space-y-0 mt-4 max-w-[500px] ml-auto text-right">
              {PRODUCTION_ACCENTS.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onMouseEnter={() => setHoveredLine(i)}
                  onMouseLeave={() => setHoveredLine(null)}
                  whileHover={{ x: -3 }}
                  className="py-4 cursor-default"
                >
                  <p
                    className="font-body font-light transition-all duration-300"
                    style={{
                      fontSize: '1.0625rem',
                      lineHeight: 1.7,
                      color: hoveredLine === i ? '#F0F0F0' : '#EAEAEA',
                    }}
                  >
                    {line}
                  </p>
                  {i < PRODUCTION_ACCENTS.length - 1 && (
                    <div
                      className="mt-3 ml-auto w-[75%] h-px transition-opacity duration-300"
                      style={{
                        backgroundColor: '#2A2A2D',
                        opacity: hoveredLine === i ? 1 : 0.7,
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Видео */}
          <motion.div
            style={{ scale: videoScale }}
            className="relative w-full aspect-video lg:aspect-[16/9] overflow-hidden rounded-2xl border border-[#2A2A2D] group/video"
          >
            <iframe
              src={`https://rutube.ru/play/embed/${RUTUBE_VIDEO_ID}/?muted=1&autoPlay=1&skinColor=EAEAEA`}
              title="Производство памятников"
              className="absolute inset-0 w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Overlay: тёмный градиент + затемнение по краям */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover/production:opacity-75"
              style={{
                background: `
                  linear-gradient(to top, rgba(17,18,20,0.6) 0%, transparent 40%),
                  linear-gradient(to right, rgba(17,18,20,0.3) 0%, transparent 12%, transparent 88%, rgba(17,18,20,0.3) 100%)
                `,
                opacity: 0.85,
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 7. Материалы (сетка) ──────────────────────────────────────────────────
const MATERIALS_PER_PAGE = 12; // 3 ряда × 4 колонки

function BlockMaterials() {
  const [hoveredId, setHoveredId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(MATERIALS_PER_PAGE);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const visibleMaterials = MATERIALS.slice(0, visibleCount);
  const hasMore = visibleCount < MATERIALS.length;
  const isExpanded = visibleCount >= MATERIALS.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + MATERIALS_PER_PAGE, MATERIALS.length));
  };

  const handleCollapse = () => {
    setVisibleCount(MATERIALS_PER_PAGE);
  };

  return (
    <section
      ref={ref}
      className="py-section lg:py-section-lg px-6 md:px-12 lg:px-16"
      style={{ backgroundColor: '#0F0F10' }}
    >
      <div className="max-w-[1320px] mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 lg:mb-20"
        >
          <span
            className="block text-micro tracking-[0.18em] uppercase font-light mb-3"
            style={{ color: 'rgba(154,154,154,0.5)' }}
          >
            Материалы
          </span>
          <h2
            className="font-heading text-section font-medium tracking-[-0.01em] mb-3"
            style={{ color: '#EAEAEA' }}
          >
            Виды гранита
          </h2>
          <p className="text-lead font-light max-w-xl" style={{ color: '#9A9A9A' }}>
            Натуральные камни, с которыми мы работаем
          </p>
        </motion.div>

        {/* Сетка 4 колонки */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
            hidden: {},
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 md:gap-x-16 lg:gap-x-[80px] gap-y-10 lg:gap-y-12"
        >
          {visibleMaterials.map((m) => {
            const isHovered = hoveredId === m.id;
            const hasHover = hoveredId !== null;
            const isDimmed = hasHover && !isHovered;

            return (
              <motion.div
                key={m.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                animate={{ opacity: isDimmed ? 0.35 : 1 }}
                onMouseEnter={() => setHoveredId(m.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="flex items-center gap-4 w-full min-h-[56px] cursor-default"
              >
                {/* Квадрат 56×56px */}
                <motion.div
                  animate={{ scale: isHovered ? 1.08 : 1 }}
                  transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
                  className="w-14 h-14 shrink-0 rounded-[7px] overflow-hidden border-2 border-white/20"
                >
                  <img
                    src={m.image}
                    alt={m.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Текст */}
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <div className="relative pb-2">
                    <p
                      className="font-heading font-medium text-[0.9375rem] leading-[1.35] line-clamp-2"
                      style={{ color: '#EAEAEA' }}
                    >
                      {m.title}
                    </p>
                    {/* Линия под названием при hover */}
                    <motion.div
                      initial={false}
                      animate={{ scaleX: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-0 top-full h-px origin-left"
                      style={{ width: '55%', backgroundColor: 'rgba(234,234,234,0.7)' }}
                    />
                  </div>
                  <p
                    className={`font-body font-light text-[0.8125rem] leading-[1.35] mt-0.5 transition-all duration-300 ${isHovered ? 'whitespace-normal overflow-visible' : 'truncate'}`}
                    style={{ color: '#8A8A8A' }}
                  >
                    {m.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Кнопки Показать еще / Свернуть */}
        {(hasMore || isExpanded) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 lg:mt-16 flex justify-center"
          >
            <button
              type="button"
              onClick={hasMore ? handleShowMore : handleCollapse}
              className="inline-flex items-center gap-2 px-8 py-5 border border-[#2A2A2D] rounded-[16px] font-body text-sm font-light tracking-wide transition-all duration-300 hover:bg-[rgba(42,42,45,0.3)] hover:border-[#353538]"
              style={{ color: '#EAEAEA' }}
            >
              {hasMore ? 'Показать еще' : 'Свернуть'}
              <span style={{ color: '#8A8A8A' }}>{hasMore ? '→' : '↑'}</span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── 7b. Готовые работы (премиальный showcase) ─────────────────────────────────
// Центральный визуальный блок. Один большой слайд, структурированный текст и управление.
const READY_WORKS = [
  { image: '/ready-works/project-12.png', title: 'Мемориальный комплекс', subtitle: 'Серпухов / гранит / индивидуальный проект' },
  { image: '/ready-works/project-1.png', title: 'Мемориальный комплекс', subtitle: 'Московская область / комбинированный гранит' },
  { image: '/ready-works/project-2.png', title: 'Мемориальный комплекс', subtitle: 'Серпухов / гранит' },
  { image: '/ready-works/project-3.png', title: 'Мемориальный комплекс', subtitle: 'Московская область / комбинированный гранит' },
  { image: '/ready-works/project-4.png', title: 'Мемориальный комплекс', subtitle: 'Серпухов / гранит' },
  { image: '/ready-works/project-5.png', title: 'Мемориальный комплекс', subtitle: 'Московская область / гранит' },
  { image: '/ready-works/project-6.png', title: 'Мемориальный комплекс', subtitle: 'Московская область / комбинированный гранит' },
  { image: '/ready-works/project-7.png', title: 'Мемориальный комплекс', subtitle: 'Серпухов / гранит' },
  { image: '/ready-works/project-8.png', title: 'Мемориальный комплекс', subtitle: 'Московская область / гранит' },
  { image: '/ready-works/project-9.png', title: 'Мемориальный комплекс', subtitle: 'Серпухов / гранит' },
  { image: '/ready-works/project-10.png', title: 'Мемориальный комплекс', subtitle: 'Московская область / гранит' },
  { image: '/ready-works/project-11.png', title: 'Мемориальный комплекс', subtitle: 'Серпухов / гранит / скульптура ангела' },
  { image: '/ready-works/project-13.png', title: 'Мемориальный комплекс', subtitle: 'Сахаровы / гранит / индивидуальный проект' },
  { image: '/ready-works/project-14.png', title: 'Мемориальный комплекс', subtitle: 'Чёрный гранит / индивидуальный проект с резной скульптурой' },
];

const TOTAL = READY_WORKS.length;
const easeSoft = [0.22, 1, 0.36, 1];

const NavArrow = ({ dir, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
    style={{
      border: '1px solid rgba(255,255,255,0.1)',
      backgroundColor: 'rgba(255,255,255,0.03)',
      color: '#EAEAEA',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {dir === 'prev' ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
    </svg>
  </button>
);

function BlockReadyWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const goPrev = () => setIndex((i) => (i - 1 + TOTAL) % TOTAL);
  const goNext = () => setIndex((i) => (i + 1) % TOTAL);
  const openLightbox = () => setLightboxOpen(true);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -50) goNext();
    else if (info.offset.x > 50) goPrev();
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  const prevIdx = (index - 1 + TOTAL) % TOTAL;
  const nextIdx = (index + 1) % TOTAL;
  const active = READY_WORKS[index];

  return (
    <section
      ref={ref}
      className="py-[7.5rem] px-6 md:px-12 lg:px-20"
      style={{ backgroundColor: '#0F0F10' }}
    >
      <div className="max-w-[1520px] mx-auto">
        {/* Label, заголовок, подзаголовок — по левому краю */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: easeSoft }}
          className="mb-12 lg:mb-14"
        >
          <span
            className="inline-block font-body text-[0.75rem] uppercase tracking-[0.22em] mb-3"
            style={{ color: '#8A8A8A' }}
          >
            ФОТОГАЛЕРЕЯ
          </span>
          <h2
            className="font-heading font-medium tracking-[-0.02em] text-[#EAEAEA] mb-3"
            style={{ fontSize: 'clamp(2rem, 2.8vw, 2.75rem)', lineHeight: 1.15 }}
          >
            Готовые работы
          </h2>
          <p
            className="font-body font-light max-w-xl"
            style={{ fontSize: 'clamp(0.9375rem, 1.1vw, 1.0625rem)', color: '#9A9A9A' }}
          >
            Реализованные мемориальные комплексы и благоустройство
          </p>
        </motion.div>

        {/* Слайдер — центральный showcase */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            className="flex items-center justify-center gap-4 lg:gap-8 py-6 cursor-grab active:cursor-grabbing"
          >
            {/* Левый слайд (боковой) */}
            <motion.div
              role="button"
              tabIndex={0}
              onClick={() => setIndex(prevIdx)}
              onKeyDown={(e) => e.key === 'Enter' && setIndex(prevIdx)}
              className="hidden sm:flex flex-shrink-0 w-[clamp(140px,18%,200px)] h-[clamp(200px,32vw,340px)] items-center justify-center cursor-pointer"
              style={{ filter: 'blur(2px)' }}
            >
              <motion.div
                className="w-full h-full rounded-[28px] overflow-hidden bg-[#111]"
                animate={{ scale: 0.85, opacity: 0.35 }}
                transition={{ duration: 0.55, ease: easeSoft }}
              >
                <img
                  src={READY_WORKS[prevIdx].image}
                  alt=""
                  className="w-full h-full object-contain object-center"
                  style={{ filter: 'brightness(0.92) contrast(1.03) saturate(0.9)' }}
                />
              </motion.div>
            </motion.div>

            {/* Центральный слайд */}
            <motion.button
              type="button"
              onClick={openLightbox}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="relative flex-shrink-0 w-full max-w-[min(1100px,90vw)] h-[clamp(340px,40vw,600px)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F0F10] rounded-[28px] overflow-hidden"
              animate={{
                scale: hovered ? 1.02 : 1,
                boxShadow: hovered
                  ? '0 50px 140px rgba(0,0,0,0.65)'
                  : '0 40px 120px rgba(0,0,0,0.6)',
              }}
              transition={{ duration: 0.5, ease: easeSoft }}
            >
              <div
                className="absolute inset-0 rounded-[28px] overflow-hidden bg-[#111] flex items-center justify-center"
                style={{
                  boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ scale: 0.94, opacity: 0.7 }}
                    animate={{
                      scale: hovered ? 1.02 : 1,
                      opacity: 1,
                    }}
                    exit={{ scale: 0.9, opacity: 0.4 }}
                    transition={{ duration: 0.6, ease: easeSoft }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* Фон: blur, заполняет блок */}
                    <img
                      src={active.image}
                      alt=""
                      aria-hidden
                      className="absolute w-full h-full object-cover"
                      style={{
                        filter: 'blur(30px) brightness(0.4)',
                        transform: 'scale(1.1)',
                      }}
                    />
                    {/* Основное изображение: не режется */}
                    <img
                      src={active.image}
                      alt={active.title}
                      className="relative max-w-full max-h-full w-auto h-auto object-contain mx-auto transition-[filter] duration-300"
                      style={{
                        filter: hovered ? 'brightness(0.96) contrast(1.03) saturate(0.92)' : 'brightness(0.92) contrast(1.03) saturate(0.9)',
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Subtle glow под слайдом */}
              <div
                className="absolute -inset-4 rounded-[36px] pointer-events-none -z-10 opacity-40"
                style={{
                  background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,255,255,0.03) 0%, transparent 70%)',
                }}
                aria-hidden
              />
            </motion.button>

            {/* Правый слайд (боковой) */}
            <motion.div
              role="button"
              tabIndex={0}
              onClick={() => setIndex(nextIdx)}
              onKeyDown={(e) => e.key === 'Enter' && setIndex(nextIdx)}
              className="hidden sm:flex flex-shrink-0 w-[clamp(140px,18%,200px)] h-[clamp(200px,32vw,340px)] items-center justify-center cursor-pointer"
              style={{ filter: 'blur(2px)' }}
            >
              <motion.div
                className="w-full h-full rounded-[28px] overflow-hidden bg-[#111]"
                animate={{ scale: 0.85, opacity: 0.35 }}
                transition={{ duration: 0.55, ease: easeSoft }}
              >
                <img
                  src={READY_WORKS[nextIdx].image}
                  alt=""
                  className="w-full h-full object-contain object-center"
                  style={{ filter: 'brightness(0.92) contrast(1.03) saturate(0.9)' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Блок текста + управление — одна линия */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-8 lg:mt-10 max-w-[1100px] mx-auto px-2"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease: easeSoft }}
                className="flex-1 min-w-0"
              >
                <p
                  className="font-heading font-medium"
                  style={{ fontSize: 'clamp(1.0625rem, 1.2vw, 1.25rem)', color: '#EAEAEA', lineHeight: 1.4 }}
                >
                  {active.title}
                </p>
                <p
                  className="font-body font-light mt-1.5"
                  style={{ fontSize: 'clamp(0.875rem, 0.95vw, 0.9375rem)', color: '#8A8A8A', lineHeight: 1.4 }}
                >
                  {active.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Навигация: стрелки + счётчик */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <NavArrow dir="prev" onClick={goPrev} label="Назад" />
              <span
                className="font-heading tabular-nums min-w-[4ch] text-center"
                style={{ fontSize: '0.9375rem', color: '#6f6f6f' }}
              >
                {String(index + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
              </span>
              <NavArrow dir="next" onClick={goNext} label="Вперёд" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Lightbox */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92"
              onClick={() => setLightboxOpen(false)}
            >
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white z-10 transition-colors border border-white/10 hover:border-white/20"
                aria-label="Закрыть"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white z-10 transition-colors border border-white/10 hover:border-white/20"
                aria-label="Назад"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white z-10 transition-colors border border-white/10 hover:border-white/20"
                aria-label="Вперёд"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <motion.img
                key={index}
                src={READY_WORKS[index]?.image}
                alt=""
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.3, ease: easeSoft }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

// ─── 8. Почему нам доверяют проекты ────────────────────────────────────────────
const TRUST_SEGMENTS = [
  { title: 'Материалы', description: 'Работаем напрямую с карьерами в России, Европе и Азии' },
  { title: 'Производство', description: 'Современное оборудование и контроль качества на каждом этапе' },
  { title: 'Договор', description: 'Фиксированные сроки, стоимость и ответственность' },
  { title: 'Сопровождение', description: 'Персональный менеджер от замера до установки' },
  { title: 'Опыт', description: 'Работаем с 1999 года, реализованы тысячи комплексов' },
];

function BlockTrust() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      ref={ref}
      className="py-section lg:py-[clamp(5rem,10vh,7rem)] px-6 md:px-12 lg:px-20"
      style={{ backgroundColor: '#0F0F10' }}
    >
      <div className="max-w-[1520px] mx-auto">
        {/* Label и заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 lg:mb-10"
        >
          <span
            className="inline-block font-body text-[0.75rem] uppercase tracking-[0.22em] mb-3"
            style={{ color: '#8A8A8A' }}
          >
            Доверие
          </span>
          <h2
            className="font-heading font-medium tracking-[-0.02em] text-[#EAEAEA]"
            style={{ fontSize: 'clamp(2rem, 2.8vw, 2.75rem)', lineHeight: 1.15 }}
          >
            Почему нам доверяют сложные проекты
          </h2>
        </motion.div>

        {/* Горизонтальная лента из 5 сегментов */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-nowrap overflow-x-auto overflow-y-hidden rounded-[24px] border border-[#2A2A2D] lg:overflow-hidden scrollbar-hide"
          style={{ backgroundColor: '#141518' }}
        >
          {TRUST_SEGMENTS.map((item, i) => {
            const isActive = activeIndex === i;
            return (
              <motion.div
                key={i}
                layout
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(0)}
                className="relative flex flex-col justify-center px-5 py-7 lg:px-8 lg:py-10 cursor-default min-w-[200px] sm:min-w-[220px] lg:min-w-0 shrink-0 lg:shrink border-r border-[#2A2A2D] last:border-r-0"
                style={{
                  flex: isActive ? 2.2 : 1,
                  transition: 'flex 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {/* Subtle radial glow для активного */}
                {isActive && (
                  <motion.div
                    layoutId="trust-glow"
                    className="absolute inset-0 pointer-events-none opacity-30"
                    initial={false}
                    transition={{ duration: 0.4 }}
                    style={{
                      background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(60,60,65,0.4) 0%, transparent 70%)',
                    }}
                  />
                )}

                <div className="relative z-10">
                  <motion.p
                    animate={{
                      opacity: isActive ? 1 : 0.65,
                      color: isActive ? '#EAEAEA' : '#B0B0B4',
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="font-body text-base lg:text-[1.0625rem] font-medium"
                  >
                    {item.title}
                  </motion.p>
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      maxHeight: isActive ? 120 : 0,
                      marginTop: isActive ? 8 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <motion.p
                      initial={false}
                      animate={{
                        y: isActive ? 0 : 12,
                        filter: isActive ? 'blur(0px)' : 'blur(4px)',
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="font-body text-[0.9375rem] leading-relaxed"
                      style={{ color: '#8A8A8A' }}
                    >
                      {item.description}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── 10. Финальный блок контактов ──────────────────────────────────────────
const MESSENGER_LINKS = [
  { id: 'wa', href: CONTACTS.whatsapp, icon: 'wa' },
  { id: 'tg', href: CONTACTS.telegram, icon: 'tg' },
];

function BlockFinal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={ref}
      id="consult"
      className="py-[clamp(4rem,8vh,6rem)] px-6 md:px-12 lg:px-20 bg-bg-main"
    >
      <motion.div
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="max-w-[1520px] mx-auto rounded-[24px] p-8 md:p-10 lg:p-12"
        style={{
          backgroundColor: '#121317',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="grid lg:grid-cols-[0.55fr_1fr] lg:gap-12 xl:gap-16 items-center">
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="space-y-6 min-w-0">
            <motion.h2
              variants={itemVariants}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-medium tracking-[-0.02em]"
              style={{ color: '#EAEAEA', fontSize: 'clamp(1.5rem, 2.2vw, 2.25rem)', lineHeight: 1.15 }}
            >
              Наши контакты
            </motion.h2>

            {/* Плашка мессенджеров */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="group flex items-center justify-between gap-4 px-5 py-3.5 rounded-[16px] transition-all duration-300 hover:bg-[rgba(255,255,255,0.04)]"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.02)',
              }}
            >
              <span className="font-body font-light text-sm" style={{ color: '#EAEAEA' }}>
                Наши месседжеры
              </span>
              <div className="flex items-center gap-3">
                {MESSENGER_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-all duration-300 hover:translate-x-0.5 hover:bg-[rgba(255,255,255,0.06)]"
                    style={{ color: '#9A9A9E' }}
                    aria-label={link.id === 'wa' ? 'WhatsApp' : 'Telegram'}
                  >
                    {link.icon === 'wa' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    )}
                    {link.icon === 'tg' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Адреса, телефон, почта — ниже плашки */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-x-6 gap-y-4"
            >
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#EAEAEA' }}>Офис</p>
                <p className="font-body font-light text-sm leading-relaxed" style={{ color: '#EAEAEA' }}>{CONTACTS.office}</p>
              </div>
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#EAEAEA' }}>Производство</p>
                <p className="font-body font-light text-sm leading-relaxed" style={{ color: '#EAEAEA' }}>{CONTACTS.production}</p>
              </div>
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#EAEAEA' }}>Телефон</p>
                <a href={CONTACTS.phone} className="font-body font-light text-sm transition-colors hover:opacity-80 block" style={{ color: '#EAEAEA' }}>
                  {PHONE}
                </a>
              </div>
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#EAEAEA' }}>Почта</p>
                <a href={`mailto:${CONTACTS.email}`} className="font-body font-light text-sm transition-colors hover:opacity-80 block" style={{ color: '#EAEAEA' }}>
                  {CONTACTS.email}
                </a>
              </div>
            </motion.div>
          </div>

          {/* ПРАВАЯ КОЛОНКА — карта */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[20px] h-[240px] lg:h-[280px] border border-[#2A2A2D]/60"
          >
            <iframe
              src={CONTACTS.mapUrl}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              title="Карта"
              className="absolute inset-0 w-full h-full border-0"
            />
            <div
              className="absolute inset-0 pointer-events-none rounded-[20px]"
              style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
              aria-hidden
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <footer
      ref={ref}
      className="border-t border-[#2A2A2D]"
      style={{ backgroundColor: '#0B0B0C' }}
    >
      <div className="max-w-[1520px] mx-auto px-6 md:px-12 lg:px-20 py-12 lg:py-16">
        {/* Верхняя строка */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 lg:mb-14"
        >
          <span className="font-heading text-[1.125rem] font-medium tracking-wide" style={{ color: '#EAEAEA' }}>
            StellaPremium
          </span>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href={`tel:${PHONE.replace(/\s/g, '')}`}
              className="font-body text-sm font-light transition-colors duration-300 hover:text-[#EAEAEA]"
              style={{ color: '#8A8A8A' }}
            >
              {PHONE}
            </a>
            <a
              href="#consult"
              className="font-body text-sm font-light inline-flex items-center gap-2 transition-all duration-300 hover:text-[#EAEAEA] hover:underline underline-offset-4"
              style={{ color: '#8A8A8A' }}
            >
              Связаться
              <span>→</span>
            </a>
          </div>
        </motion.div>

        {/* Центральная зона */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-10 lg:mb-12 font-body text-sm font-light"
          style={{ color: '#8A8A8A' }}
        >
          <span>Работаем с 1999 года</span>
          <span className="opacity-40">·</span>
          <span>Проекты по Москве и области</span>
          <span className="opacity-40">·</span>
          <span>Работа по договору</span>
          <span className="opacity-40">·</span>
          <span>Собственное производство</span>
        </motion.div>

        {/* Нижняя зона */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-[#2A2A2D]/60"
        >
          <span className="font-body text-sm font-light" style={{ color: '#8A8A8A' }}>
            © StellaPremium
          </span>
          <a
            href="/privacy"
            className="font-body text-sm font-light transition-colors duration-300 hover:text-[#EAEAEA]"
            style={{ color: '#8A8A8A' }}
          >
            Политика конфиденциальности
          </a>
        </motion.div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BlockMeaning />
        <BlockProject />
        <BlockProjects />
        <BlockProduction />
        <BlockMaterials />
        <BlockReadyWorks />
        <BlockTrust />
        <BlockFinal />
      </main>
      <Footer />
    </>
  );
}

export default App;
