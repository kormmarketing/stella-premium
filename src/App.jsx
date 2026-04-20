import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return;

    const body = document.body;
    const attr = 'data-scroll-lock-count';
    const current = Number(body.getAttribute(attr) || '0');
    const next = current + 1;

    body.setAttribute(attr, String(next));
    if (current === 0) body.style.overflow = 'hidden';

    return () => {
      const latest = Number(body.getAttribute(attr) || '1');
      const decremented = Math.max(0, latest - 1);
      if (decremented === 0) {
        body.style.overflow = '';
        body.removeAttribute(attr);
      } else {
        body.setAttribute(attr, String(decremented));
      }
    };
  }, [locked]);
}

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
  '/project-01.png', '/portfolio-new/new-01.png', '/portfolio-new/new-02.png', '/portfolio-new/new-03.png', '/portfolio-new/new-04.png',
  '/portfolio-new/new-05.png', '/portfolio-new/new-06.png', '/portfolio-new/new-07.png', '/portfolio-new/new-08.png', '/portfolio-new/new-09.png',
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
  { id: 'tsvetok-urala', title: 'Цветок Урала', subtitle: 'серо-розовый, среднезернистый, Челябинская область, Россия', image: '/material-imperial-black.png' },
  { id: 'leznikovsky', title: 'Лезниковский', subtitle: 'красный, насыщенный, крупнозернистый, Украина', image: '/material-olive-green.png' },
  { id: 'baltik-green', title: 'Балтик Грин', subtitle: 'зелёный с чёрными пятнами, Финляндия', image: '/material-blue-pearl.png' },
  { id: 'amphibolit', title: 'Амфиболит', subtitle: 'тёмно-зелёный, почти чёрный, плотный, Россия', image: '/material-kapustinsky.png' },
  { id: 'baltik-blue', title: 'Балтик Блю', subtitle: 'тёмный с синими переливами, Норвегия', image: '/material-light-grey.png' },
  { id: 'mansurovsky', title: 'Мансуровский', subtitle: 'светло-серый, равномерный, Россия', image: '/material-mansurovsky.png' },
  { id: 'sopka-buntina', title: 'Сопка Бунтина', subtitle: 'тёмный, выразительная текстура, Россия', image: '/material-sopka-buntina.png' },
  { id: 'nero-afrika', title: 'Цветок Урала', subtitle: 'чёрный с серыми вкраплениями, Челябинская область, Россия', image: '/material-imperial-black.png' },
];

const PHONE = '+7(903)116-81-19';
const CONTACTS = {
  whatsapp: `https://wa.me/${PHONE.replace(/\D/g, '')}`,
  telegram: 'https://t.me/stellapam',
  max: 'https://max.ru/u/f9LHodD0cOIE2oBqKVJm1aN-mtTa5utCm0wRHiUbCqi257toIDysqmB6UO0',
  phone: `tel:${PHONE.replace(/\s/g, '')}`,
  email: 'stellapremium1999@yandex.ru',
  office: 'Москва, ул. Миклухо-Маклая, 53к1',
  production: 'Серпухов, ул. Базовая, 7',
  mapUrl: 'https://yandex.ru/map-widget/v1/?ll=37.455,55.279&pt=37.506,55.649~37.404,54.909&z=9&l=map',
};

const NAV_LINKS = [
  { href: '#showcase', label: 'Проект' },
  { href: '#production', label: 'Производство' },
  { href: '#materials', label: 'Материалы' },
  { href: '#visit', label: 'Замеры' },
  { href: '#consult', label: 'Контакты' },
];

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
      initial={false}
      animate={{ opacity: 1, y: 0 }}
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useBodyScrollLock(isMenuOpen);

  return (
    <motion.header
      style={{ backgroundColor: bg, backdropFilter: blur, WebkitBackdropFilter: blur }}
      className="fixed top-0 left-0 right-0 z-50 py-5 px-6 md:px-12 lg:px-16 max-md:py-4 max-md:px-5"
    >
      <div className="max-w-content mx-auto flex justify-between items-center">
        <a href="/" className="inline-flex items-center">
          <img
            src="/brand-logo.png"
            alt="Стелла Премиум"
            className="h-10 md:h-11 w-auto object-contain origin-left scale-[1.1] md:scale-[1.2]"
          />
        </a>
        <nav className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] font-body font-light tracking-[0.06em] uppercase text-text-muted hover:text-text-main transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-8 max-md:gap-3">
          <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="text-text-muted text-sm font-light hover:text-text-main transition-colors hidden sm:block">
            {PHONE}
          </a>
          <a
            href="#consult"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 max-md:px-5 max-md:h-[52px] rounded-[8px] border border-white text-text-main text-sm font-light hover:bg-white hover:border-white group transition-all duration-300"
          >
            <span className="group-hover:text-[#0F0F10] transition-colors duration-300">Связаться</span>
          </a>
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="lg:hidden w-11 h-11 rounded-[14px] border border-white/20 flex items-center justify-center text-white/85"
            aria-label="Открыть меню"
          >
            <span className="relative w-5 h-4 block">
              <span className={`absolute left-0 h-px w-5 bg-current transition-all ${isMenuOpen ? 'top-2 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-2 h-px w-5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 h-px w-5 bg-current transition-all ${isMenuOpen ? 'top-2 -rotate-45' : 'top-4'}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24 }}
            className="lg:hidden mt-3 rounded-[18px] border border-white/10 bg-[#131416]/95 backdrop-blur-xl p-4"
          >
            <div className="flex flex-col">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 border-b border-white/10 last:border-0 text-[13px] uppercase tracking-[0.08em] text-[#D7D7D9] font-body"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
    <section id="hero" ref={ref} className="relative min-h-screen max-md:min-h-0 flex flex-col justify-end lg:justify-center overflow-hidden" style={{ backgroundColor: '#0F0F10' }}>
      {/* Desktop: полноэкранное изображение */}
      <motion.div style={{ scale }} className="absolute inset-0 max-md:hidden">
        <img
          src={IMAGES.hero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[22%_50%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(15,15,16,0.92) 0%, rgba(15,15,16,0.86) 44%, rgba(15,15,16,0.55) 52%, rgba(15,15,16,0.18) 62%, transparent 72%)',
          }}
        />
        <div className="absolute inset-0 bg-black/18" />
      </motion.div>

      {/* Desktop контент */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 px-6 md:px-12 lg:px-16 pb-20 lg:pb-32 pt-[140px] lg:pt-0 max-w-content max-md:hidden"
      >
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-hero font-medium text-text-main tracking-[0.02em] max-w-2xl mb-4"
        >
          <span className="uppercase tracking-wider">Мемориальные комплексы из гранита</span>
          <span className="block font-light tracking-[-0.01em] text-lead mt-4 normal-case">с индивидуальным проектом и установкой под ключ</span>
        </motion.h1>

        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
          className="text-body text-text-muted/80 font-light max-w-lg mb-10"
        >
          Полный цикл работ: проект, производство и установка. Персональный менеджер ведёт проект до результата.
        </motion.p>

        <motion.a
          href="#consult"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="inline-flex items-center justify-center gap-2 min-w-[440px] px-20 py-4 rounded-[8px] border border-white text-text-main text-sm font-light tracking-wide transition-colors duration-150 group hover:bg-white hover:border-white"
        >
          <span className="group-hover:text-[#0F0F10] transition-colors duration-150">Получить расчёт проекта</span>
          <span className="text-text-muted group-hover:text-[#0F0F10] transition-colors duration-150">→</span>
        </motion.a>
      </motion.div>

      {/* Mobile Hero: центрированная premium композиция */}
      <div className="md:hidden relative z-10 mobile-container pt-[96px] pb-14 flex flex-col items-center text-center">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5 flex flex-col items-center w-full"
        >
          {/* Media container — без фона, центрирован */}
          <div className="overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] h-[260px] max-h-[280px] w-full">
            <img
              src={IMAGES.hero}
              alt=""
              className="w-full h-full object-contain object-center"
            />
          </div>

          {/* Label — центрирован */}
          <span
            className="block font-body text-[12px] uppercase tracking-[0.15em]"
            style={{ color: 'rgba(234,234,234,0.55)' }}
          >
            Мемориальные комплексы
          </span>

          {/* Title — центрирован, полная ширина контейнера */}
          <h1 className="font-heading font-medium text-text-main tracking-[0.02em] leading-[1.12] text-[34px] sm:text-[38px] w-full">
            <span className="uppercase tracking-wider">Мемориальные комплексы из гранита</span>
            <span className="block font-light tracking-[-0.01em] normal-case mt-1.5 text-[18px] sm:text-[20px] leading-[1.3]">с индивидуальным проектом и установкой под ключ</span>
          </h1>

          {/* Supporting text — центрирован, полная ширина */}
          <p className="font-body font-light text-[16px] leading-[1.55] w-full" style={{ color: '#9A9A9A' }}>
            Полный цикл работ: проект, производство и установка. Персональный менеджер ведёт проект до результата.
          </p>

          {/* CTA — центрирован */}
          <a
            href="#consult"
            className="inline-flex items-center justify-center gap-2 h-[54px] min-w-[200px] px-8 mt-5 rounded-[8px] border border-white text-text-main text-[15px] font-light tracking-wide transition-colors duration-150 group hover:bg-white hover:border-white"
          >
            <span className="group-hover:text-[#0F0F10] transition-colors duration-150">Получить расчёт проекта</span>
            <span className="text-text-muted group-hover:text-[#0F0F10] transition-colors duration-150">→</span>
          </a>
        </motion.div>
      </div>
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
      className="group relative w-full text-left overflow-hidden rounded-2xl border border-[#2A2A2D] bg-[#131416] transition-[border-color,background-color] duration-300 hover:border-[#3a3a3e] hover:bg-[#16171A] cursor-pointer max-md:rounded-[20px] max-md:border-[rgba(255,255,255,0.06)] max-md:bg-[rgba(19,20,22,0.6)] max-md:min-h-0 max-md:py-0"
    >
      <div className="relative flex items-center gap-8 md:gap-12 lg:gap-16 px-6 md:px-8 lg:px-10 py-5 md:py-6 min-h-[72px] md:min-h-[84px] max-md:gap-4 max-md:px-5 max-md:py-[18px]">
        {/* Номер этапа — mobile: 14–16px, opacity 0.35–0.45 */}
        <span
          className="font-heading font-light tabular-nums shrink-0 transition-opacity duration-500 group-hover:opacity-100 max-md:text-[15px]"
          style={{
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
            color: '#EAEAEA',
            opacity: 0.35,
            letterSpacing: '-0.02em',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Название этапа — mobile: 16px, line-height 1.35–1.45 */}
        <span className="flex-1 font-body text-[clamp(1.125rem, 1.25vw, 1.25rem)] font-light text-[#EAEAEA] tracking-wide leading-snug max-md:text-[16px] max-md:leading-[1.4]">
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
  useBodyScrollLock(stepIndex != null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, [stepIndex]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
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
      id="process"
      ref={sectionRef}
      className="relative py-[clamp(6rem,12vh,9rem)] px-6 md:px-12 lg:px-20 overflow-hidden max-md:py-[56px] max-md:px-0"
      style={{ backgroundColor: '#0F0F10' }}
    >
      <div className="max-w-[1520px] mx-auto max-md:mobile-container max-md:flex max-md:flex-col max-md:items-center max-md:text-center">
        {/* Текстовая часть — mobile: центрирована, полная ширина */}
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-16 lg:gap-24 items-start mb-16 lg:mb-20 max-md:mb-6 max-md:gap-6 max-md:block max-md:w-full max-md:mx-auto">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="lg:sticky lg:top-[140px] lg:-mt-16"
          >
            {/* Label — mobile: центрирован */}
            <span
              className="inline-block font-body text-[0.8125rem] uppercase tracking-[0.2em] mb-2 max-md:text-[12px] max-md:tracking-[0.15em] max-md:opacity-60"
              style={{ color: '#9A9A9A' }}
            >
              Процесс
            </span>
            <h2
              className="font-heading font-medium tracking-[-0.02em] mb-6 max-md:text-[30px] max-md:leading-[1.2] max-md:mb-3 max-md:w-full max-md:mx-auto"
              style={{
                fontSize: 'clamp(2.25rem, 3.5vw, 3.25rem)',
                lineHeight: 1.12,
                color: '#EAEAEA',
              }}
            >
              Работаем с проектом, а не с отдельным изделием
            </h2>
            {/* Mobile: 2 абзаца по центру */}
            <div
              className="font-body font-light leading-relaxed max-w-lg space-y-12 text-right ml-auto mt-24 max-md:mt-0 max-md:text-center max-md:space-y-3 max-md:text-[16px] max-md:leading-[1.55] max-md:ml-0"
              style={{
                fontSize: 'clamp(1.0625rem, 1.2vw, 1.25rem)',
                color: '#9A9A9A',
              }}
            >
              <p>Мы не просто изготавливаем памятник.<br />Мы ведём весь проект — от участка до установки.</p>
              <p>Берём на себя подбор материалов, разработку внешнего вида, технические решения и оформление документов.</p>
              <p className="max-md:hidden">Вы понимаете, как будет выглядеть результат ещё до начала работ и не погружаетесь в сложные детали процесса.</p>
            </div>
          </motion.div>

          {/* Step cards — mobile: центрированы */}
          <div className="flex flex-col gap-3 md:gap-4 max-md:gap-3 max-md:mt-5 max-md:w-full max-md:mx-auto">
            {PROCESS_STEPS.map((step, i) => (
              <ProcessStepCard key={i} step={step} index={i} onClick={setActiveStep} />
            ))}
          </div>

          {/* Mobile CTA — центрирован */}
          <a
            href="#consult"
            className="hidden max-md:inline-flex items-center justify-center gap-2 h-[54px] px-8 rounded-[8px] border border-white text-text-main text-[15px] font-light tracking-wide transition-colors mt-6 group hover:bg-white hover:border-white max-md:mx-auto"
          >
            <span className="group-hover:text-[#0F0F10] transition-colors">Узнать подробнее</span>
            <span className="text-text-muted group-hover:text-[#0F0F10] transition-colors">→</span>
          </a>
        </div>
      </div>

      {/* Modal — рендер в body через portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeStep != null && PROCESS_STEP_DETAILS[activeStep] && (
            <motion.div
              key={`process-modal-${activeStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[140] flex items-center justify-center p-4 sm:p-6"
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
  const [mobileActiveStep, setMobileActiveStep] = useState(0);

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
      id="showcase"
      ref={sectionRef}
      className="relative px-6 md:px-12 lg:px-20 max-md:px-0 md:min-h-[300vh]"
      style={{ backgroundColor: '#0F0F10' }}
    >
      {/* Desktop: sticky layout */}
      <div
        className="sticky top-0 min-h-screen flex items-center py-20 lg:py-28 max-md:hidden"
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

      {/* Mobile: premium infographic block — tap-based step switcher */}
      <div className="md:hidden mobile-container py-[56px] flex flex-col items-center text-center">
        <div className="w-full space-y-5">
          {/* Label */}
          <span className="block font-body text-[12px] uppercase tracking-[0.15em] opacity-60" style={{ color: '#9A9A9A' }}>
            Проект
          </span>

          {/* Title */}
          <h2 className="font-heading font-medium tracking-[-0.02em] text-[30px] leading-[1.2] text-[#EAEAEA] w-full">
            Сначала проект — потом изготовление
          </h2>

          {/* Short text */}
          <p className="font-body font-light text-[16px] leading-[1.55] w-full" style={{ color: '#9A9A9A' }}>
            До начала работ вы понимаете, как будет выглядеть комплекс и что входит в состав.
          </p>

          {/* 4 этапа — 2x2 infographic grid, интерактивные */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {PROJECT_STEPS.map((step, i) => {
              const isActive = mobileActiveStep === i;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setMobileActiveStep(i)}
                  className={`rounded-[18px] border p-4 text-left transition-all duration-300 ${
                    isActive
                      ? 'border-[rgba(255,255,255,0.2)] bg-[rgba(30,31,34,0.8)] shadow-[0_0_20px_rgba(255,255,255,0.04)]'
                      : 'border-[rgba(255,255,255,0.06)] bg-[rgba(19,20,22,0.6)]'
                  }`}
                >
                  <span
                    className={`font-heading text-[13px] tabular-nums block mb-1 transition-colors ${
                      isActive ? 'text-[rgba(234,234,234,0.9)]' : 'text-[rgba(234,234,234,0.5)]'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span
                    className={`font-body font-light text-[15px] leading-[1.35] tracking-wide block transition-colors ${
                      isActive ? 'text-[#EAEAEA]' : 'text-[#B0B0B4]'
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Visual block — меняется при тапе на этап */}
          <div className="overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] h-[240px] mt-6">
            <AnimatePresence mode="wait">
              <motion.img
                key={PROJECT_STEPS[mobileActiveStep].image}
                src={PROJECT_STEPS[mobileActiveStep].image}
                alt={PROJECT_STEPS[mobileActiveStep].title}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full object-contain object-center"
              />
            </AnimatePresence>
          </div>

          {/* Short поясняющий текст */}
          <p className="font-body font-light text-[15px] leading-[1.55] w-full" style={{ color: '#C8C8CA' }}>
            Вы можете заказать только услугу создания проекта. А изготовителя выбрать самостоятельно.
          </p>

          {/* CTA — центрирован */}
          <div className="flex justify-center mt-5">
            <a
              href="#consult"
              className="inline-flex items-center justify-center gap-2 h-[54px] min-w-[180px] px-8 rounded-[8px] border border-white text-text-main text-[15px] font-light tracking-wide group hover:bg-white hover:border-white transition-colors"
            >
              <span className="group-hover:text-[#0F0F10] transition-colors">Заказать проект</span>
              <span className="text-text-muted group-hover:text-[#0F0F10] transition-colors">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. Проекты — один кейс: макет + чертежи ──────────────────────────────
const PROJECT_SHOWCASE = {
  title: 'Мемориальный комплекс №3',
  subtitle: 'Индивидуальный проект / Мансуровский гранит',
  description: 'Мемориальный комплекс из гранита Габбро-диабаз и Мансуровского.',
  specs: [
    { label: 'Проект', value: 'Индивидуальный проект' },
    { label: 'Покрытие участка', value: 'Плитка из габбро-диабаза, термообработка' },
    { label: 'Размер плит', value: '60 x 40 см' },
    { label: 'Параметры участка', value: '2 x 2,5 м, устойчивый грунт' },
    { label: 'Фундамент', value: 'Армированное бетонное основание — 20 см' },
    { label: 'Сваи по углам', value: 'Армирование: Ø12, глубина: 1 м' },
  ],
  mockups: [
    '/case-showcase/mockup-main-2.png',
    '/case-showcase/mockup-main.png',
    '/case-showcase/mockup-01.png',
    '/case-showcase/mockup-02.png',
    '/case-showcase/mockup-04.png',
  ],
  drawings: [
    '/case-showcase/drawing-09.png',
    '/case-showcase/drawing-05.png',
    '/case-showcase/drawing-07.png',
    '/case-showcase/drawing-01.png',
    '/case-showcase/drawing-02.png',
    '/case-showcase/drawing-03.png',
    '/case-showcase/drawing-04.png',
    '/case-showcase/drawing-06.png',
    '/case-showcase/drawing-08.png',
    '/case-showcase/drawing-10.png',
    '/case-showcase/drawing-11.png',
    '/case-showcase/drawing-12.png',
  ],
};

function BlockProjects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [mockupIndex, setMockupIndex] = useState(0);
  const [drawingIndex, setDrawingIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null); // { type: 'mockup' | 'drawing', index: number }

  const mockupTotal = PROJECT_SHOWCASE.mockups.length;
  const drawingTotal = PROJECT_SHOWCASE.drawings.length;

  const activeMockup = PROJECT_SHOWCASE.mockups[mockupIndex];
  const activeDrawing = PROJECT_SHOWCASE.drawings[drawingIndex];

  const goMockupNext = () => setMockupIndex((i) => (i + 1) % mockupTotal);
  const goMockupPrev = () => setMockupIndex((i) => (i - 1 + mockupTotal) % mockupTotal);
  const goDrawingNext = () => setDrawingIndex((i) => (i + 1) % drawingTotal);
  const goDrawingPrev = () => setDrawingIndex((i) => (i - 1 + drawingTotal) % drawingTotal);

  const openLightbox = (type, index) => setLightbox({ type, index });
  const closeLightbox = () => setLightbox(null);
  const isValidLightbox =
    !!lightbox &&
    (lightbox.type === 'mockup' || lightbox.type === 'drawing') &&
    Number.isInteger(lightbox.index) &&
    lightbox.index >= 0 &&
    lightbox.index < (lightbox.type === 'mockup' ? PROJECT_SHOWCASE.mockups.length : PROJECT_SHOWCASE.drawings.length);
  const lightboxList = !isValidLightbox
    ? null
    : lightbox.type === 'mockup'
      ? PROJECT_SHOWCASE.mockups
      : PROJECT_SHOWCASE.drawings;
  const lightboxSrc = isValidLightbox && lightboxList ? lightboxList[lightbox.index] : '';
  const lightboxTotal = lightboxList?.length || 0;
  useBodyScrollLock(isValidLightbox);

  const goLightboxNext = () => {
    if (!lightboxList || !lightbox) return;
    setLightbox((prev) => ({ ...prev, index: (prev.index + 1) % lightboxList.length }));
  };

  const goLightboxPrev = () => {
    if (!lightboxList || !lightbox) return;
    setLightbox((prev) => ({ ...prev, index: (prev.index - 1 + lightboxList.length) % lightboxList.length }));
  };

  useEffect(() => {
    if (!isValidLightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goLightboxPrev();
      if (e.key === 'ArrowRight') goLightboxNext();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isValidLightbox, goLightboxNext, goLightboxPrev]);

  return (
    <section
      id="production"
      ref={sectionRef}
      className="relative py-[clamp(6rem,12vh,9rem)] px-6 md:px-12 lg:px-20 overflow-hidden max-md:py-[56px] max-md:px-0"
      style={{ backgroundColor: '#0F0F10' }}
    >
      <div className="max-w-[1520px] mx-auto max-md:mobile-container">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 lg:mb-10 max-md:text-center"
        >
          <span className="inline-block font-body text-[0.75rem] uppercase tracking-[0.2em] mb-2" style={{ color: '#8A8A8A' }}>
            Портфолио
          </span>
          <h2 className="font-heading font-medium tracking-[-0.02em] mb-3 max-md:text-[28px]" style={{ fontSize: 'clamp(2rem, 2.8vw, 2.75rem)', color: '#EAEAEA' }}>
            Пример проекта
          </h2>
          <p className="font-body font-light text-[1rem] max-md:text-[16px] max-w-[900px] max-md:max-w-none" style={{ color: '#9A9A9A' }}>
            Как мы прорабатываем детали проекта
          </p>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[28px] border p-4 md:p-6 lg:p-8"
          style={{ backgroundColor: '#16171A', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="grid lg:grid-cols-2 gap-4 md:gap-6 items-start">
            <div className="rounded-[22px] border p-3 md:p-4" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#111214' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full bg-black/45 text-white/80">Макет</span>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-[0.8125rem] tabular-nums" style={{ color: '#6B6B6B' }}>
                    {String(mockupIndex + 1).padStart(2, '0')} / {String(mockupTotal).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={goMockupPrev}
                    className="w-9 h-9 rounded-full border"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: '#9A9A9A' }}
                    aria-label="Предыдущий макет"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={goMockupNext}
                    className="w-9 h-9 rounded-full border"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: '#9A9A9A' }}
                    aria-label="Следующий макет"
                  >
                    →
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openLightbox('mockup', mockupIndex)}
                className="relative overflow-hidden rounded-[18px] w-full h-[260px] md:h-[440px] bg-[#0F1012] border border-white/5"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={mockupIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    src={activeMockup}
                    alt={`${PROJECT_SHOWCASE.title} — макет ${mockupIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </AnimatePresence>
              </button>
            </div>

            <div className="rounded-[22px] border p-3 md:p-4" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#111214' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full bg-black/45 text-white/80">Чертежи</span>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-[0.8125rem] tabular-nums" style={{ color: '#6B6B6B' }}>
                    {String(drawingIndex + 1).padStart(2, '0')} / {String(drawingTotal).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={goDrawingPrev}
                    className="w-9 h-9 rounded-full border"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: '#9A9A9A' }}
                    aria-label="Предыдущий чертеж"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={goDrawingNext}
                    className="w-9 h-9 rounded-full border"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: '#9A9A9A' }}
                    aria-label="Следующий чертеж"
                  >
                    →
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openLightbox('drawing', drawingIndex)}
                className="relative overflow-hidden rounded-[18px] w-full h-[260px] md:h-[300px] bg-[#0F1012] border border-white/5"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={drawingIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    src={activeDrawing}
                    alt={`${PROJECT_SHOWCASE.title} — чертеж ${drawingIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </AnimatePresence>
              </button>

              <div className="mt-3 grid grid-cols-4 md:grid-cols-6 gap-2">
                {PROJECT_SHOWCASE.drawings.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setDrawingIndex(idx)}
                    className="relative h-[54px] md:h-[62px] rounded-[10px] overflow-hidden border transition-colors"
                    style={{
                      borderColor: idx === drawingIndex ? 'rgba(255,255,255,0.34)' : 'rgba(255,255,255,0.09)',
                      backgroundColor: '#0E0F11',
                    }}
                    aria-label={`Показать чертеж ${idx + 1}`}
                  >
                    <img src={img} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 md:mt-6 flex flex-col gap-2 max-md:text-center">
            <p className="font-body font-light text-[15px] leading-relaxed max-w-[900px] max-md:mx-auto max-md:max-w-none" style={{ color: '#9A9A9A' }}>
              {PROJECT_SHOWCASE.description}
            </p>
            <div className="mt-2 grid md:grid-cols-2 gap-x-8 gap-y-2 max-w-[980px] max-md:w-full">
              {PROJECT_SHOWCASE.specs.map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <span className="mt-2 w-1 h-1 rounded-full bg-white/45 shrink-0" aria-hidden />
                  <p className="font-body font-light text-[14px] leading-[1.55]" style={{ color: 'rgba(234,234,234,0.78)' }}>
                    <span style={{ color: '#B8B8BC' }}>{item.label}:</span> {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isValidLightbox && lightboxList && lightboxSrc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[140] bg-black/92 p-4 md:p-8 pt-[96px] md:pt-[96px] flex flex-col"
              onClick={closeLightbox}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 rounded-[12px] text-sm border border-white/15 text-white/85">
                    {lightbox.type === 'mockup' ? 'Макет' : 'Чертеж'}
                  </span>
                  <span className="font-heading text-sm tabular-nums text-white/55">
                    {String(lightbox.index + 1).padStart(2, '0')} / {String(lightboxTotal).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goLightboxPrev(); }}
                    className="w-10 h-10 rounded-full border border-white/15 text-white/80"
                    aria-label="Назад"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goLightboxNext(); }}
                    className="w-10 h-10 rounded-full border border-white/15 text-white/80"
                    aria-label="Вперед"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="w-10 h-10 rounded-full border border-white/15 text-white/80"
                    aria-label="Закрыть"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <img src={lightboxSrc} alt="" className="max-w-full max-h-[80vh] object-contain" />
              </div>
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
// Короткие формулировки для mobile
const PRODUCTION_ACCENTS_MOBILE = [
  'Современное оборудование',
  'Большой склад натурального камня',
  'Контроль качества на каждом этапе',
  'Изготовление строго по проекту',
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
      className="relative py-[clamp(6rem,12vh,9rem)] px-6 md:px-12 lg:px-20 overflow-hidden max-md:py-[56px] max-md:px-0"
      style={{ backgroundColor: '#111214' }}
    >
      <div className="max-w-[1520px] mx-auto group/production max-md:mobile-container max-md:flex max-md:flex-col max-md:items-center max-md:text-center">
        <div className="grid lg:grid-cols-[0.4fr_1fr] gap-16 lg:gap-24 items-end max-md:gap-8 max-md:grid-cols-1 max-md:w-full max-md:mx-auto">
          {/* Текст — desktop: справа, mobile: центрирован */}
          <div className="lg:max-w-md max-md:order-2 max-md:w-full">
            <span
              className="inline-block font-body text-[0.8125rem] uppercase tracking-[0.2em] mb-2 max-md:text-[12px] max-md:opacity-60"
              style={{ color: '#9A9A9A' }}
            >
              Производство
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-medium tracking-[-0.02em] mb-4 max-md:text-[30px] max-md:mb-4 max-md:w-full"
              style={{
                fontSize: 'clamp(2rem, 2.8vw, 2.75rem)',
                lineHeight: 1.12,
                color: '#EAEAEA',
              }}
            >
              Собственное производство
            </motion.h2>
            {/* Mobile: короткий вводный текст */}
            <p className="md:hidden font-body font-light text-[16px] leading-[1.55] mb-5 w-full text-center" style={{ color: '#9A9A9A' }}>
              Полный контроль над качеством и сроками на каждом этапе.
            </p>
            {/* Desktop: длинные строки с hover */}
            <div className="space-y-0 mt-4 max-w-[500px] max-lg:mx-auto max-lg:text-center lg:ml-auto lg:text-right max-md:hidden">
              {PRODUCTION_ACCENTS.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                      className="mt-3 w-[75%] h-px transition-opacity duration-300 max-lg:mx-auto lg:ml-auto"
                      style={{
                        backgroundColor: '#2A2A2D',
                        opacity: hoveredLine === i ? 1 : 0.7,
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
            {/* Mobile: premium список преимуществ с иконками */}
            <div className="md:hidden flex flex-col gap-[14px] w-full text-center">
              {PRODUCTION_ACCENTS_MOBILE.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.12 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-center gap-3 text-center w-full"
                >
                  <span
                    className="shrink-0 mt-0.5"
                    style={{ color: 'rgba(255,255,255,0.85)' }}
                    aria-hidden
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span
                    className="font-body font-light text-[15px] leading-[1.5]"
                    style={{ color: 'rgba(255,255,255,0.88)' }}
                  >
                    {line}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Видео — mobile: сверху, height 210–240px */}
          <motion.div
            style={{ scale: videoScale }}
            className="relative w-full aspect-video lg:aspect-[16/9] overflow-hidden rounded-2xl max-md:rounded-[24px] border border-[#2A2A2D] group/video max-md:order-1 max-md:aspect-auto max-md:h-[225px] max-md:mt-5"
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

  return (
    <section
      id="materials"
      ref={ref}
      className="py-section lg:py-section-lg px-6 md:px-12 lg:px-16 max-md:py-[56px] max-md:mobile-container"
      style={{ backgroundColor: '#0F0F10' }}
    >
      <div className="max-w-[1320px] mx-auto max-md:flex max-md:flex-col max-md:items-center max-md:text-center">
        {/* Заголовок — mobile: центрирован */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 lg:mb-20 max-md:mb-10"
        >
          <span
            className="block text-micro tracking-[0.18em] uppercase font-light mb-3 max-md:opacity-60"
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
          <p className="text-lead font-light max-w-xl max-md:w-full" style={{ color: '#9A9A9A' }}>
            Натуральные камни, с которыми мы работаем
          </p>
        </motion.div>

        {/* Сетка 4 колонки */}
        <motion.div
          initial="hidden"
          animate="visible"
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
                    style={m.id === 'sopka-buntina' ? { objectPosition: 'center 38%' } : undefined}
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 lg:mt-16 flex justify-center"
          >
            {hasMore ? (
              <button
                type="button"
                onClick={handleShowMore}
                className="inline-flex items-center gap-2 px-8 py-5 border border-[#2A2A2D] rounded-[8px] font-body text-sm font-light tracking-wide transition-all duration-300 hover:bg-[rgba(42,42,45,0.3)] hover:border-[#353538]"
                style={{ color: '#EAEAEA' }}
              >
                Показать еще
                <span style={{ color: '#8A8A8A' }}>→</span>
              </button>
            ) : (
              <a
                href="#consult"
                className="inline-flex items-center gap-2 px-8 py-5 border border-[#2A2A2D] rounded-[8px] font-body text-sm font-light tracking-wide transition-all duration-300 hover:bg-[rgba(42,42,45,0.3)] hover:border-[#353538]"
                style={{ color: '#EAEAEA' }}
              >
                Запросить полный список материалов
                <span style={{ color: '#8A8A8A' }}>→</span>
              </a>
            )}
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
  { image: '/portfolio-new/new-01.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — срок изготовления 3 недели, установка 3 дня' },
  { image: '/portfolio-new/new-02.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — изготовление до 1 месяца, установка 5 дней' },
  { image: '/portfolio-new/new-03.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — срок производства 3–4 недели, установка 4 дня' },
  { image: '/portfolio-new/new-04.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — изготовление 1 месяц, монтаж 6 дней' },
  { image: '/portfolio-new/new-05.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — срок выполнения 3 недели, установка 3 дня' },
  { image: '/portfolio-new/new-06.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — изготовление до 4 недель, установка 5 дней' },
  { image: '/portfolio-new/new-07.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — срок производства 3 недели, монтаж 4 дня' },
  { image: '/portfolio-new/new-08.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — изготовление 1 месяц, установка 7 дней' },
  { image: '/portfolio-new/new-09.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — срок выполнения 3–4 недели, монтаж 5 дней' },
  { image: '/portfolio-new/new-10.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — изготовление до 1 месяца, установка 3 дня' },
  { image: '/portfolio-new/new-11.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — срок производства 3 недели, установка 6 дней' },
  { image: '/portfolio-new/new-12.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — изготовление 4 недели, монтаж 4 дня' },
  { image: '/portfolio-new/new-13.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — срок выполнения 1 месяц, установка 5 дней' },
  { image: '/portfolio-new/new-14.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — изготовление 3 недели, установка 7 дней' },
  { image: '/portfolio-new/new-15.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — срок производства 3–4 недели, монтаж 3 дня' },
  { image: '/portfolio-new/new-16.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — изготовление до 1 месяца, установка 6 дней' },
  { image: '/portfolio-new/new-17.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — срок выполнения 4 недели, монтаж 5 дней' },
  { image: '/portfolio-new/new-18.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — изготовление 3 недели, установка 4 дня' },
  { image: '/portfolio-new/new-19.png', title: 'Мемориальный комплекс', subtitle: 'Мемориальный комплекс — срок производства до 1 месяца, монтаж 3 дня' },
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
  useBodyScrollLock(lightboxOpen);

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
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen]);

  const prevIdx = (index - 1 + TOTAL) % TOTAL;
  const nextIdx = (index + 1) % TOTAL;
  const active = READY_WORKS[index];

  return (
    <section
      id="gallery"
      ref={ref}
      className="py-[7.5rem] px-6 md:px-12 lg:px-20 max-md:py-[56px] max-md:mobile-container"
      style={{ backgroundColor: '#0F0F10' }}
    >
      <div className="max-w-[1520px] mx-auto max-md:flex max-md:flex-col max-md:items-center max-md:text-center">
        {/* Label, заголовок — mobile: центрированы */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeSoft }}
          className="mb-12 lg:mb-14 max-md:mb-8 max-md:w-full max-md:mx-auto"
        >
          <span
            className="inline-block font-body text-[0.75rem] uppercase tracking-[0.22em] mb-3 max-md:opacity-60"
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
            className="font-body font-light max-w-xl max-md:w-full"
            style={{ fontSize: 'clamp(0.9375rem, 1.1vw, 1.0625rem)', color: '#9A9A9A' }}
          >
            Реализованные мемориальные комплексы и благоустройство
          </p>
        </motion.div>

        {/* Слайдер — центральный showcase */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
              className="relative flex-shrink-0 w-full max-w-[min(1100px,90vw)] h-[clamp(340px,40vw,600px)] max-md:h-[300px] max-md:rounded-[24px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F0F10] rounded-[28px] overflow-hidden"
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
            animate={{ opacity: 1 }}
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
            <div className="flex items-center gap-4 flex-shrink-0 max-sm:mx-auto">
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
              className="fixed inset-0 z-[140] flex items-center justify-center bg-black/92"
              onClick={() => setLightboxOpen(false)}
            >
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-[96px] md:top-[96px] right-6 w-12 h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white z-10 transition-colors border border-white/10 hover:border-white/20"
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

// ─── 8. Выезд специалиста на участок ───────────────────────────────────────────
function BlockSiteVisit() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="visit"
      ref={ref}
      className="relative py-[100px] px-6 md:px-12 lg:px-20 max-md:py-[72px]"
      style={{ background: 'linear-gradient(180deg, #141414 0%, #1a1a1a 100%)' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          opacity: 0.04,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 34px, rgba(255,255,255,0.22) 35px), repeating-linear-gradient(90deg, transparent 0px, transparent 34px, rgba(255,255,255,0.22) 35px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-[60px] items-start"
        >
          <div className="w-full aspect-square rounded-[10px] overflow-hidden bg-[#222222]">
            <img
              src="/site-visit-form.png"
              alt="Лист выезда специалиста на участок"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="h-full flex flex-col">
            <span
              className="inline-block font-body text-[0.75rem] uppercase tracking-[0.2em] mb-2"
              style={{ color: '#8A8A8A' }}
            >
              ЗАМЕРЫ
            </span>
            <h2
              className="font-heading font-medium tracking-[-0.01em] -mt-2 mb-6"
              style={{ fontSize: '36px', lineHeight: 1.2, color: '#FFFFFF' }}
            >
              Выезд менеджера на замеры
            </h2>

            <p
              className="font-body font-light mt-auto mb-auto"
              style={{ fontSize: '16px', lineHeight: 1.6, color: '#CFCFCF' }}
            >
              Напишите нам, и мы согласуем удобное для вас время вызеда нашего менеджера для замеров участка и бесплатной консультации.
              <span className="block mt-2">Это БЕСПЛАТНО!</span>
            </p>

            <div className="flex flex-col items-center mt-auto pt-6">
              <a
                href="#consult"
                className="inline-flex items-center justify-center px-[22px] py-[14px] rounded-[8px] transition-colors duration-300 hover:bg-[#EAEAEA]"
                style={{ backgroundColor: '#FFFFFF', color: '#000000', fontSize: '15px', fontWeight: 500 }}
              >
                Заказать бесплатный замер
              </a>

              <p className="font-body font-light mt-3 text-center" style={{ fontSize: '13px', color: '#8A8A8A' }}>
                Отвечаем сразу. Подберём удобное время
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 9. Почему нам доверяют проекты ────────────────────────────────────────────
const TRUST_ICONS = {
  materials: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  ),
  production: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="20" width="20" height="2" rx="1" />
      <path d="M4 20V10l4-4 4 2 4-2 4 4v10" />
      <path d="M8 8V6" />
      <path d="M16 8V6" />
    </svg>
  ),
  contract: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  ),
  support: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  experience: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
};

const TRUST_SEGMENTS = [
  { title: 'Материалы', description: 'Работаем напрямую с карьерами в России, Европе и Азии', icon: 'materials' },
  { title: 'Производство', description: 'Современное оборудование и контроль качества на каждом этапе', icon: 'production' },
  { title: 'Договор', description: 'Фиксированные сроки, стоимость и ответственность', icon: 'contract' },
  { title: 'Сопровождение', description: 'Персональный менеджер от замера до установки', icon: 'support' },
  { title: 'Опыт', description: 'Работаем с 1999 года, реализованы тысячи комплексов', icon: 'experience' },
];

function BlockTrust() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="trust"
      ref={ref}
      className="py-section lg:py-[clamp(5rem,10vh,7rem)] px-6 md:px-12 lg:px-20 max-md:py-[56px] max-md:px-0"
      style={{ backgroundColor: '#0F0F10' }}
    >
      <div className="max-w-[1520px] mx-auto max-md:mobile-container max-md:flex max-md:flex-col max-md:items-center max-md:text-center">
        {/* Label и заголовок — mobile: центрированы */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 lg:mb-10 max-md:mb-6 max-md:w-full max-md:mx-auto"
        >
          <span
            className="inline-block font-body text-[0.75rem] uppercase tracking-[0.22em] mb-3 max-md:text-[12px] max-md:opacity-60"
            style={{ color: '#8A8A8A' }}
          >
            Доверие
          </span>
          <h2
            className="font-heading font-medium tracking-[-0.02em] text-[#EAEAEA] max-md:text-[28px] max-md:leading-[1.2] max-md:w-full"
            style={{ fontSize: 'clamp(2rem, 2.8vw, 2.75rem)', lineHeight: 1.15 }}
          >
            Почему нам доверяют сложные проекты
          </h2>
        </motion.div>

        {/* Desktop: горизонтальная лента */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex flex-nowrap overflow-x-auto overflow-y-hidden rounded-[24px] border border-[#2A2A2D] lg:overflow-hidden scrollbar-hide"
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

        {/* Mobile: premium glass-карточки с иконками */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden flex flex-col gap-3 w-full max-w-[520px] mx-auto"
        >
          {TRUST_SEGMENTS.map((item, i) => {
            const IconComp = TRUST_ICONS[item.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 1.02 }}
                className="relative rounded-[24px] p-5 overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Внутренний glow */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-[24px] opacity-40"
                  style={{
                    background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)',
                  }}
                  aria-hidden
                />
                <div className="relative z-10 flex items-start gap-4">
                  <span className="shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.8)' }} aria-hidden>
                    {IconComp && IconComp()}
                  </span>
                  <div>
                    <p className="font-body font-medium text-[16px] mb-1.5" style={{ color: '#EAEAEA' }}>
                      {item.title}
                    </p>
                    <p className="font-body font-light text-[15px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {item.description}
                    </p>
                  </div>
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
  { id: 'max', href: CONTACTS.max, icon: 'max' },
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
      className="py-[clamp(4rem,8vh,6rem)] px-6 md:px-12 lg:px-20 bg-bg-main max-md:py-[56px] max-md:px-5"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-[1520px] mx-auto rounded-[24px] p-8 md:p-10 lg:p-12 max-md:rounded-[24px] max-md:p-5"
        style={{
          backgroundColor: '#121317',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="grid lg:grid-cols-[0.55fr_1fr] lg:gap-12 xl:gap-16 items-center max-md:grid-cols-1 max-md:gap-8 max-md:flex max-md:flex-col max-md:items-center max-md:text-center">
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="space-y-6 min-w-0 max-md:space-y-5 max-md:w-full max-md:flex max-md:flex-col max-md:items-center">
            {/* Desktop: заголовок */}
            <motion.div
              variants={itemVariants}
              className="mb-1"
            >
              <img
                src="/brand-logo.png"
                alt="Стелла Премиум"
                className="h-[74px] md:h-[90px] w-auto object-contain mx-auto md:mx-0 opacity-95 contrast-110 brightness-110"
              />
            </motion.div>
            <motion.h2
              variants={itemVariants}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-medium tracking-[-0.02em] hidden md:block"
              style={{ color: '#EAEAEA', fontSize: 'clamp(1.5rem, 2.2vw, 2.25rem)', lineHeight: 1.15 }}
            >
              Наши контакты
            </motion.h2>

            {/* Mobile: новая структура — заголовок, подзаголовок, кнопки */}
            <div className="md:hidden w-full flex flex-col items-center">
              <motion.h2
                variants={itemVariants}
                className="font-heading font-medium tracking-[-0.02em] text-[28px] mb-2"
                style={{ color: '#EAEAEA', lineHeight: 1.15 }}
              >
                Связаться с нами
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="font-body font-light text-[15px] mb-5"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Выберите удобный способ
              </motion.p>

              {/* Крупные кнопки связи */}
              <div className="flex flex-col gap-3 w-full max-w-[360px]">
                <motion.a
                  href={CONTACTS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 w-full py-4 px-5 rounded-[8px] transition-all duration-200 active:opacity-90"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#EAEAEA',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="font-body font-light text-[16px]">WhatsApp</span>
                </motion.a>
                <motion.a
                  href={CONTACTS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 w-full py-4 px-5 rounded-[8px] transition-all duration-200 active:opacity-90"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#EAEAEA',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="font-body font-light text-[16px]">Telegram</span>
                </motion.a>
                <motion.a
                  href={CONTACTS.max}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 w-full py-4 px-5 rounded-[8px] transition-all duration-200 active:opacity-90"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#EAEAEA',
                  }}
                >
                  <img
                    src="/max-logo.png"
                    alt=""
                    aria-hidden
                    className="w-5 h-5 rounded-[6px] object-cover ring-1 ring-white/15 grayscale contrast-125 brightness-110"
                  />
                  <span className="font-body font-light text-[16px]">MAX</span>
                </motion.a>
                <motion.a
                  href={CONTACTS.phone}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 w-full py-4 px-5 rounded-[8px] transition-all duration-200 active:opacity-90"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#EAEAEA',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="font-body font-light text-[16px]">Позвонить</span>
                </motion.a>
              </div>
            </div>

            {/* Desktop: плашка мессенджеров */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:flex items-center justify-between gap-4 px-5 py-3.5 rounded-[8px] transition-all duration-300 hover:bg-[rgba(255,255,255,0.04)]"
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
                    {link.icon === 'max' && (
                      <img
                        src="/max-logo.png"
                        alt=""
                        aria-hidden
                        className="w-5 h-5 rounded-[6px] object-cover ring-1 ring-white/15 grayscale contrast-125 brightness-110"
                      />
                    )}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Адреса, телефон, почта */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-2 max-md:grid-cols-1 max-md:gap-y-4 max-md:text-center max-md:w-full max-md:max-w-[360px]"
            >
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-wider mb-1 max-md:opacity-50" style={{ color: '#EAEAEA' }}>Москва</p>
                <p className="font-body font-light text-sm leading-relaxed max-md:text-[15px]" style={{ color: 'rgba(255,255,255,0.85)' }}>{CONTACTS.office}</p>
              </div>
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-wider mb-1 max-md:opacity-50" style={{ color: '#EAEAEA' }}>Серпухов</p>
                <p className="font-body font-light text-sm leading-relaxed max-md:text-[15px]" style={{ color: 'rgba(255,255,255,0.85)' }}>{CONTACTS.production}</p>
              </div>
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-wider mb-1 max-md:opacity-50" style={{ color: '#EAEAEA' }}>Телефон</p>
                <a href={CONTACTS.phone} className="font-body font-light text-sm transition-colors hover:opacity-80 block max-md:text-[15px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {PHONE}
                </a>
              </div>
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-wider mb-1 max-md:opacity-50" style={{ color: '#EAEAEA' }}>Почта</p>
                <a href={`mailto:${CONTACTS.email}`} className="font-body font-light text-sm transition-colors hover:opacity-80 block max-md:text-[15px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {CONTACTS.email}
                </a>
              </div>
            </motion.div>
          </div>

          {/* ПРАВАЯ КОЛОНКА — карта (на mobile ниже, центрирована) */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[20px] max-md:rounded-[20px] h-[240px] lg:h-[280px] max-md:h-[190px] border border-[#2A2A2D]/60 max-md:order-last max-md:w-full max-md:mx-auto"
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
      <div className="max-w-[1520px] mx-auto px-6 md:px-12 lg:px-20 py-12 lg:py-16 max-md:px-5 max-md:py-8">
        {/* Верхняя строка */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 lg:mb-14 max-md:mb-6 max-md:gap-4"
        >
          <img
            src="/brand-logo.png"
            alt="Стелла Премиум"
            className="h-[36px] md:h-[42px] w-auto object-contain opacity-95 contrast-110 brightness-110"
          />
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

        {/* Центральная зона — скрыта на mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex flex-wrap items-center gap-x-4 gap-y-2 mb-10 lg:mb-12 font-body text-sm font-light"
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
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-[#2A2A2D]/60"
        >
          <span className="font-body text-sm font-light" style={{ color: '#8A8A8A' }}>
            © СтеллаПремиум
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

function PrivacyContent() {
  return (
    <section
      className="px-5 py-[80px] md:py-[80px] max-md:pt-[120px] max-md:pb-[60px]"
      style={{ backgroundColor: '#0F0F10' }}
    >
      <div className="max-w-[880px] mx-auto">
        <h1
          className="font-heading font-medium tracking-[-0.02em] text-center mb-10"
          style={{
            color: '#EAEAEA',
            fontSize: 'clamp(2rem, 3.2vw, 2.5rem)',
            lineHeight: 1.15,
          }}
        >
          Политика конфиденциальности
        </h1>

        <div
          className="font-body font-light space-y-4"
          style={{
            color: 'rgba(234,234,234,0.78)',
            fontSize: '16px',
            lineHeight: 1.72,
          }}
        >
          <h2 className="font-body font-medium pt-4" style={{ color: '#EAEAEA', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1.35 }}>
            1. Общие положения
          </h2>
          <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты информации о пользователях сайта <strong>Stella Premium</strong> (далее — Сайт).</p>
          <p>Используя Сайт, пользователь выражает согласие с настоящей Политикой.</p>

          <h2 className="font-body font-medium pt-4" style={{ color: '#EAEAEA', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1.35 }}>
            2. Какие данные мы собираем
          </h2>
          <p>Мы не используем формы сбора персональных данных на Сайте.</p>
          <p>При этом автоматически могут собираться:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>IP-адрес пользователя</li>
            <li>данные о браузере и устройстве</li>
            <li>cookies</li>
            <li>информация о посещённых страницах и действиях на Сайте</li>
          </ul>

          <h2 className="font-body font-medium pt-4" style={{ color: '#EAEAEA', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1.35 }}>
            3. Использование аналитики
          </h2>
          <p>На Сайте используется сервис веб-аналитики <strong>Яндекс.Метрика</strong>.</p>
          <p>Сервис может собирать обезличенные данные о поведении пользователей, включая:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>посещаемые страницы</li>
            <li>время нахождения на сайте</li>
            <li>действия пользователя (клики, прокрутка)</li>
          </ul>
          <p>
            Обработка данных осуществляется в соответствии с политикой Яндекса:{' '}
            <a
              href="https://yandex.ru/legal/confidential/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
              style={{ color: '#EAEAEA' }}
            >
              https://yandex.ru/legal/confidential/
            </a>
          </p>

          <h2 className="font-body font-medium pt-4" style={{ color: '#EAEAEA', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1.35 }}>
            4. Использование cookies
          </h2>
          <p>Сайт использует cookies для:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>корректной работы сайта</li>
            <li>анализа поведения пользователей</li>
            <li>улучшения пользовательского опыта</li>
          </ul>
          <p>Пользователь может отключить cookies в настройках браузера.</p>

          <h2 className="font-body font-medium pt-4" style={{ color: '#EAEAEA', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1.35 }}>
            5. Взаимодействие через мессенджеры
          </h2>
          <p>На Сайте размещены кнопки перехода в сторонние сервисы:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>WhatsApp</li>
            <li>Telegram</li>
            <li>Max</li>
          </ul>
          <p>При переходе в данные сервисы пользователь взаимодействует с ними на условиях их собственных политик конфиденциальности.</p>
          <p>Мы не контролируем и не несем ответственность за обработку данных в сторонних сервисах.</p>

          <h2 className="font-body font-medium pt-4" style={{ color: '#EAEAEA', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1.35 }}>
            6. Передача данных третьим лицам
          </h2>
          <p>Мы не передаем персональные данные пользователей третьим лицам, за исключением случаев, предусмотренных законодательством.</p>

          <h2 className="font-body font-medium pt-4" style={{ color: '#EAEAEA', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1.35 }}>
            7. Защита информации
          </h2>
          <p>Мы принимаем необходимые организационные и технические меры для защиты информации пользователей от несанкционированного доступа.</p>

          <h2 className="font-body font-medium pt-4" style={{ color: '#EAEAEA', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1.35 }}>
            8. Права пользователя
          </h2>
          <p>Пользователь имеет право:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>получать информацию об обработке своих данных</li>
            <li>требовать удаления или уточнения данных (если применимо)</li>
            <li>ограничить использование cookies</li>
          </ul>

          <h2 className="font-body font-medium pt-4" style={{ color: '#EAEAEA', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1.35 }}>
            9. Изменения политики
          </h2>
          <p>Мы вправе обновлять настоящую Политику без предварительного уведомления.</p>
          <p>Актуальная версия всегда доступна на данной странице.</p>

          <h2 className="font-body font-medium pt-4" style={{ color: '#EAEAEA', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1.35 }}>
            10. Контакты
          </h2>
          <p>По всем вопросам, связанным с обработкой данных, вы можете связаться с нами:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>по телефону</li>
            <li>через мессенджеры, указанные на Сайте</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────
function App() {
  const isPrivacyPage = typeof window !== 'undefined' && window.location.pathname === '/privacy';

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const loadScript = (src) => new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });

    const initExternalScripts = async () => {
      try {
        await loadScript('https://mc.yandex.ru/metrika/tag.js?id=108348707');
        if (typeof window !== 'undefined' && typeof window.ym === 'function') {
          window.ym(108348707, 'init', {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: 'dataLayer',
            referrer: document.referrer,
            url: window.location.href,
            accurateTrackBounce: true,
            trackLinks: true,
          });
        }
      } catch (error) {
        console.error('Yandex Metrika failed to initialize:', error);
      }

      try {
        await loadScript('https://cdn.callibri.ru/callibri.js');
      } catch (error) {
        console.error('Callibri failed to initialize:', error);
      }
    };

    initExternalScripts();
  }, []);

  useEffect(() => {
    const desc = document.querySelector('meta[name="description"]');
    if (isPrivacyPage) {
      document.title = 'Политика конфиденциальности | Stella Premium';
      if (desc) desc.setAttribute('content', 'Политика конфиденциальности Stella Premium');
      return;
    }
    document.title = 'Stella Premium — мемориальные комплексы из гранита под ключ';
    if (desc) {
      desc.setAttribute(
        'content',
        'Индивидуальные мемориальные комплексы из гранита с проектированием, подбором материалов, производством и установкой под ключ. Stella Premium.'
      );
    }
  }, [isPrivacyPage]);

  return (
    <>
      <Header />
      <main>
        {isPrivacyPage ? (
          <PrivacyContent />
        ) : (
          <>
            <Hero />
            <BlockMeaning />
            <BlockProject />
            <BlockProjects />
            <BlockProduction />
            <BlockMaterials />
            <BlockReadyWorks />
            <BlockSiteVisit />
            <BlockTrust />
            <BlockFinal />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
