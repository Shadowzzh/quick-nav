import { cssRule } from '../../utils/cssRule'

cssRule.add(
  ':root',
  `
    --animation-ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
    --animation-ease-out-circ: cubic-bezier(0.165, 0.84, 0.44, 1);
  `,
)
cssRule.add(
  ':root',
  `
    --theme-primary: #536EDC;
    --theme-primary-2: #e1f0fc;
    --theme-primary-3: #bfdbfa;
    --theme-primary-4: #a8b2f2;
    --theme-background: #E2E8F0;
    --theme-secondary: aliceblue;
    --theme-warning: red;
    --theme-font-family: Roboto;
  `,
)
