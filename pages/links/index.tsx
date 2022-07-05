import type { LinkType } from '../../lib/interfaces'
import LayoutBody from '../../components/layout-body'
import LayoutSEO from '../../components/layout-seo'
import PagesStyle from '../../styles/Pages.module.css'
import { getLinks } from '../../lib/posts'

export default function Links({ links }: { links: LinkType[] }) {
  return (
    <>
      <LayoutSEO title='友链' url='/links' />
      <LayoutBody title='Links'>
        <div className={PagesStyle.linksContainer}>
          <div className={PagesStyle.linksNote}>
            如果... <br />
            你也想被挂在墙上... <br />
            可以点击<a href='https://github.com/alanosy/blog-links'>[这里]</a>提交PR跟我PY... <br />
            如果... <br />
            你不是GITHUB用户... <br />
            也可以发送邮件给我... <br />
          </div>
          {
            links.map(({ name, link, description }) => (
              <section key={link} className={PagesStyle.linksItem}>
                <a href={link} target='_blank' rel='noopener noreferrer' className={PagesStyle.linksItemName}>{ name }</a>
                {
                  description && <div className={PagesStyle.linksItemDescription}>{ description }</div>
                }
              </section>
            ))
          }
        </div>
      </LayoutBody>
    </>
  )
}

export async function getStaticProps() {
  const links = getLinks()
  return {
    props: {
      links
    }
  }
}
