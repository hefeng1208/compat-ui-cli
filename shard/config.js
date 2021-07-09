const compatibleComponentMap = {
  Badge: {},
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
    deprecatedProps: ['plain'],
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
    },
    deprecatedProps: ['on-icon-click', 'radial-counter', 'click', 'auto-complete'],
  },
  Tag: {
    deleteProps: ['hit'],
    deprecatedPropValue: {
      type: ['gray'],
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
  },
  Form: {
    // 需要替换的属性
    deprecatedProps: ['label-suffix'],
  },
  Table: {
    deleteProps: ['stripe', 'border'],
    replacedPropName: {
      expand: 'expand-change',
    },
  },
  Alert: {
    deprecatedProps: ['description'],
  },
  Dialog: {},
  CollapseTransition: {},
  Loading: {},
  Autocomplete: {},
  Dropdown: {},
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
  TableColumn: {},
  DatePicker: {},
  TimeSelect: {},
  TimePicker: {},
  MessageBox: {},
  Breadcrumb: {},
  BreadcrumbItem: {},
  FormItem: {},
  Tabs: {},
  TabPane: {},
  Tree: {},
  Notification: {},
  Icon: {},
  Row: {},
  Col: {},
  Upload: {},
  Progress: {},
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
