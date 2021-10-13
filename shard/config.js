const compatibleComponentMap = {
  Badge: {
    deprecatedPropValue: {
      type: 'info',
    },
  },
  Pagination: {},
  Popover: {},
  Tooltip: {},
  Button: {
    // 需要替换的属性
    replacedPropName: {},
    // 需要替换的属性值
    replacedPropValue: {},
    // 只能删除属性，属性值只能替换
    deleteProps: [],
    // 废弃的属性
    deprecatedProps: ['plain', 'round', 'circle'],
    // 废弃的属性值,当没有替换的属性值时候使用此属性
    deprecatedPropValue: {
      type: ['success', 'warning', 'info'],
    },
  },
  Radio: {
    replacedPropValue: {
      size: {
        large: 'medium',
      },
    },
  },
  Step: {
    deprecatedProps: ['icon'],
  },
  InputNumber: {
    deprecatedPropValue: {
      size: ['large'],
    },
    deprecatedProps: ['debounce'],
  },
  Checkbox: {
    deprecatedProps: ['size'],
  },
  Input: {
    deprecatedPropValue: {
      size: ['large', 'mini'],
    },
    replacedPropName: {
      icon: 'prefix-icon',
      'radial-counter': 'show-word-limit',
    },
    deprecatedProps: ['on-icon-click', 'radial-counter', 'click', 'auto-complete'],
  },
  Tag: {
    deleteProps: ['hit', 'effect'],
    deprecatedPropValue: {
      type: ['gray'],
      size: ['medium'],
    },
    replacedPropValue: {
      size: {
        mini: 'small',
      },
    },
  },
  Switch: {
    deleteProps: ['on-color', 'off-color'],
    deprecatedProps: ['allow-focus', 'blur', 'focus'],
    replacedPropName: {
      'on-icon-class': 'active-icon-class',
      'off-icon-class': 'inactive-icon-class',
      'on-text': 'active-text',
      'off-text': 'inactive-text',
      'on-value': 'active-value',
      'off-value': 'inactive-value',
    },
  },
  Select: {
    replacedPropValue: {
      size: {
        large: 'small',
        mini: 'small',
      },
    },
  },
  Slider: {
    deleteProps: ['vertical'],
    replacedPropValue: {
      'input-size': {
        large: 'medium',
        mini: 'small',
      },
    },
  },
  Form: {
    // 需要替换的属性
    deprecatedProps: ['label-suffix', 'size', 'status-icon'],
  },
  Table: {
    deleteProps: ['stripe', 'border'],
    replacedPropName: {
      expand: 'expand-change',
    },
    deprecatedPropValue: {
      size: 'mini',
    },
  },
  TableColumn: {
    deleteProps: ['filter-by-hover'],
  },
  Alert: {
    deprecatedProps: ['description'],
  },
  Dialog: {
    replacedPropName: {
      size: 'width',
    },
    replacedPropValue: {
      size: {
        tiny: '30%',
        small: '50%',
        large: '90%',
        full: '100%',
      },
    },
  },
  CollapseTransition: {},
  Loading: {},
  Autocomplete: {},
  Dropdown: {
    deprecatedProps: ['split-button', 'type', 'click'],
  },
  DropdownMenu: {},
  DropdownItem: {},
  Menu: {},
  Submenu: {},
  MenuItem: {},
  MenuItemGroup: {},
  RadioGroup: {},
  RadioButton: {},
  CheckboxButton: {},
  CheckboxGroup: {},
  Option: {},
  OptionGroup: {},
  ButtonGroup: {},
  DatePicker: {
    deleteProps: ['size'],
  },
  TimeSelect: {},
  TimePicker: {
    deleteProps: ['size'],
  },
  DateTimePicker: {
    deleteProps: ['size'],
  },
  MessageBox: {},
  Breadcrumb: {},
  BreadcrumbItem: {},
  FormItem: {},
  Tabs: {
    deprecatedPropValue: {
      type: 'border-card',
    },
  },
  TabPane: {},
  Tree: {},
  Notification: {},
  Icon: {},
  Row: {},
  Col: {},
  Upload: {},
  Progress: {
    deleteProps: ['stroke-width', 'text-inside'],
  },
  Spinner: {},
  Message: {},
  Card: {},
  Rate: {},
  Carousel: {},
  Scrollbar: {},
  CarouselItem: {},
  Collapse: {},
  CollapseItem: {},
  Cascader: {},
  ColorPicker: {},
  Transfer: {},
  Container: {},
  Header: {},
  Aside: {},
  Main: {},
  Footer: {},
  Timeline: {},
  TimelineItem: {},
  Link: {},
  Divider: {},
  Image: {},
  Calendar: {},
  Backtop: {},
  InfiniteScroll: {},
  PageHeader: {},
  CascaderPanel: {},
  Avatar: {},
  Drawer: {},
  Popconfirm: {},
  Skeleton: {},
  SkeletonItem: {},
}

const compatibleComponents = Object.keys(compatibleComponentMap)

module.exports = {
  compatibleComponentMap,
  compatibleComponents,
}
