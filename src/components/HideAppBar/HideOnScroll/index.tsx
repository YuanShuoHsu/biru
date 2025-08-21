// https://mui.com/material-ui/react-app-bar/#system-HideAppBar.tsx
// 將棄用

import { Slide, useScrollTrigger } from "@mui/material";

interface HideOnScrollProps {
  children?: React.ReactElement<unknown>;
}

const HideOnScroll = ({ children }: HideOnScrollProps) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
};

export default HideOnScroll;
