interface SelectConfig {
  selectOptions: SelectOption[];
}

interface SelectOption {
  name: string;
  value: string;
}

const selectOptions: SelectOption[] = [
  {
    name: 'Не выбрано',
    value: '',
  },
  {
    name: 'Активный',
    value: 'active',
  },
  {
    name: 'Неактивный',
    value: 'inactive',
  },
];

export const ACTIVE_SELECT_CONFIG: SelectConfig = {
  selectOptions,
};
