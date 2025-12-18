import { Facebook, Instagram, YouTube } from "@mui/icons-material";
import { IconButton, Stack, SvgIcon, type SvgIconProps } from "@mui/material";

const LineIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M12 2C6.49 2 2 5.68 2 10.2c0 2.78 1.74 5.25 4.39 6.73-.12.43-.79 2.86-.82 3.1-.04.33.18.33.37.23.15-.08 2.33-1.53 3.28-2.18.25-.17.46-.25.78-.21.66.08 1.33.13 2 .13 5.51 0 10-3.68 10-8.2C22 5.68 17.51 2 12 2zm4.56 8.93c0 .5-.4.9-.9.9H8.34c-.5 0-.9-.4-.9-.9V7.85c0-.5.4-.9.9-.9h7.32c.5 0 .9.4.9.9v3.08z" />
  </SvgIcon>
);

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "https://www.facebook.com/",
    icon: Facebook,
    label: "Facebook",
  },
  {
    href: "https://line.me/",
    icon: LineIcon,
    label: "LINE",
  },
  {
    href: "https://www.youtube.com/",
    icon: YouTube,
    label: "YouTube",
  },
];

const FooterSocialLinks = () => (
  <Stack direction="row" gap={1}>
    {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
      <IconButton
        key={label}
        aria-label={label}
        component="a"
        href={href}
        rel="noopener noreferrer"
        size="small"
        target="_blank"
        title={label}
      >
        <Icon fontSize="small" />
      </IconButton>
    ))}
  </Stack>
);

export default FooterSocialLinks;

