import {HeaderMenuColored} from "./header"
import HeaderOld from "./headerold"
import Footer from "./footer"
import React from "react";

interface Props {
  children: React.ReactNode
}

export default function Layout({children}: Props) {
  const links = [
    {
      link: "/about",
      label: "Features"
    },
    {
      link: "#1",
      label: "Learn",
      links: [
        {
          link: "/docs",
          label: "Documentation"
        },
        {
          link: "/resources",
          label: "Resources"
        },
        {
          link: "/community",
          label: "Community"
        },
        {
          link: "/blog",
          label: "Blog"
        }
      ]
    },
    {
      link: "/about",
      label: "About"
    },
    {
      link: "/pricing",
      label: "Pricing"
    },
    {
      link: "#2",
      label: "Support",
      links: [
        {
          link: "/faq",
          label: "FAQ"
        },
        {
          link: "/demo",
          label: "Book a demo"
        },
        {
          link: "/forums",
          label: "Forums"
        }
      ]
    }
  ]
  return (
    <>
      <HeaderOld/>
      <HeaderMenuColored links={links}/>
      <main>{children}</main>
      <Footer/>
    </>
  )
}
