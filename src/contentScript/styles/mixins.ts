import { cssRule } from '../../utils/cssRule'

cssRule.add(
  ':root',
  `
    --animation-ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
    --animation-ease-out-circ: cubic-bezier(0.165, 0.84, 0.44, 1);
  `,
)

cssRule.add('navigator-panel .header', `background-color: red;`)
cssRule.add(
  ':root',
  `
    --theme-primary: green;
    --theme-secondary: aliceblue;
    --theme-warning: red;
    --theme-font-family: Roboto;
  `,
)
