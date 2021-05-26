const OPERATORS_NAMES = {
  atlas: 'Атлас',
  alfabus: 'Alfa Bus'
};

const DAY_OF_WEEK_SHORT_TRANSLATIONS = {
  monday: {
    full: '',
    short: 'Пн',
  },
  tuesday: {
    full: '',
    short: 'Вт',
  },
  wednesday: {
    full: '',
    short: 'Ср',
  },
  thursday: {
    full: '',
    short: 'Чт',
  },
  friday: {
    full: '',
    short: 'Пт',
  },
  saturday: {
    full: '',
    short: 'Сб',
  },
  sunday: {
    full: '',
    short: 'Вс',
  },
};

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

const MAX_VISIBILITY_DAYS = 14;

module.exports = {
  OPERATORS_NAMES,
  ONE_SECOND,
  ONE_MINUTE,
  MAX_VISIBILITY_DAYS,
  DAY_OF_WEEK_SHORT_TRANSLATIONS,
};