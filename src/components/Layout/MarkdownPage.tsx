import { MDXProvider } from '@mdx-js/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { MDXComponents } from '../MDX/MDXComponents';
import Docs from '../Docs';

export interface MarkdownProps<Frontmatter> {
  meta: Frontmatter & { description?: string };
  children?: React.ReactNode;
}

export function MarkdownPage<
  T extends { title: string; status?: string } = {
    title: string;
    status?: string;
  }
>({ children, meta }: MarkdownProps<T>) {
  const { route } = useRouter();

  // const {route, nextRoute, prevRoute} = useRouteMeta();
  const title = meta.title || route || '';
  // const description = meta.description || route?.description || '';

  if (!route) {
    console.error('This page was not added to one of the sidebar JSON files.');
  }

  const isHomePage = route === '/';

  const tocHeadings = React.Children.toArray(children)
    .filter((child) => {
      if (child.props?.mdxType) {
        return ['h1', 'h2', 'h3'].includes(child.props.mdxType);
      }
      return false;
    })
    .map((child: any) => ({
      url: `#${child.props.id}`,
      depth:
        (child.props?.mdxType &&
          parseInt(child.props.mdxType.replace('h', ''), 0)) ??
        0,
      text: child.props.children,
    }));

  return (
    <MDXProvider components={MDXComponents}>
      {isHomePage ? (
        children
      ) : (
        <div className="docs">
          <Docs title={title} tocHeadings={tocHeadings}>
            {children}
          </Docs>
        </div>
      )}
      <div style={{ height: '64px', boxShadow: 'inset 0px 1px #e3e8ee' }} />
    </MDXProvider>
  );
}
