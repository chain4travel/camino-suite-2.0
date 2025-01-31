export interface FooterButtonsProps {
  name: string;
  url: string;
}

export interface links {
  text: string;
  url: string;
}

export interface FooterLinksProps {
  name: string;
  links: links[];
}

export interface SocialMediaLinksProps {
  name: string;
  url: string;
  icon: string;
}

export interface FooterDataProps {
  SocialMediaLinks: Array<SocialMediaLinksProps>;
  FooterButtons: Array<FooterButtonsProps>;
  FooterLinks: Array<FooterLinksProps>;
}
