import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/blog/blog',
    component: ComponentCreator('/blog/blog', '5e2'),
    exact: true
  },
  {
    path: '/blog/blog/archive',
    component: ComponentCreator('/blog/blog/archive', '4bf'),
    exact: true
  },
  {
    path: '/blog/blog/authors',
    component: ComponentCreator('/blog/blog/authors', '44c'),
    exact: true
  },
  {
    path: '/blog/blog/authors/daikon-0313',
    component: ComponentCreator('/blog/blog/authors/daikon-0313', '69c'),
    exact: true
  },
  {
    path: '/blog/blog/sample-tech-blog',
    component: ComponentCreator('/blog/blog/sample-tech-blog', 'dcf'),
    exact: true
  },
  {
    path: '/blog/blog/tags',
    component: ComponentCreator('/blog/blog/tags', '542'),
    exact: true
  },
  {
    path: '/blog/blog/tags/best-practices',
    component: ComponentCreator('/blog/blog/tags/best-practices', 'e31'),
    exact: true
  },
  {
    path: '/blog/blog/tags/data-engineering',
    component: ComponentCreator('/blog/blog/tags/data-engineering', 'c8f'),
    exact: true
  },
  {
    path: '/blog/blog/tags/python',
    component: ComponentCreator('/blog/blog/tags/python', '619'),
    exact: true
  },
  {
    path: '/blog/blog/tags/sql',
    component: ComponentCreator('/blog/blog/tags/sql', 'bc5'),
    exact: true
  },
  {
    path: '/blog/markdown-page',
    component: ComponentCreator('/blog/markdown-page', 'b60'),
    exact: true
  },
  {
    path: '/blog/docs',
    component: ComponentCreator('/blog/docs', 'd08'),
    routes: [
      {
        path: '/blog/docs',
        component: ComponentCreator('/blog/docs', 'c0f'),
        routes: [
          {
            path: '/blog/docs',
            component: ComponentCreator('/blog/docs', 'b7b'),
            routes: [
              {
                path: '/blog/docs/apps/overview',
                component: ComponentCreator('/blog/docs/apps/overview', '5f6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/docs/bi/overview',
                component: ComponentCreator('/blog/docs/bi/overview', 'fc1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/docs/domain/overview',
                component: ComponentCreator('/blog/docs/domain/overview', '084'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/docs/dwh/snowflake/overview',
                component: ComponentCreator('/blog/docs/dwh/snowflake/overview', '7ac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/docs/infrastructure/aws-basics',
                component: ComponentCreator('/blog/docs/infrastructure/aws-basics', '224'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/docs/infrastructure/docker-basics',
                component: ComponentCreator('/blog/docs/infrastructure/docker-basics', '1be'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/docs/infrastructure/kubernetes-basics',
                component: ComponentCreator('/blog/docs/infrastructure/kubernetes-basics', '315'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/docs/intro',
                component: ComponentCreator('/blog/docs/intro', 'f6d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/docs/languages/overview',
                component: ComponentCreator('/blog/docs/languages/overview', 'f10'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/docs/others/overview',
                component: ComponentCreator('/blog/docs/others/overview', 'c44'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/blog/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/blog/docs/tutorial-basics/congratulations', '967'),
                exact: true
              },
              {
                path: '/blog/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/blog/docs/tutorial-basics/create-a-blog-post', '61e'),
                exact: true
              },
              {
                path: '/blog/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/blog/docs/tutorial-basics/create-a-document', 'd04'),
                exact: true
              },
              {
                path: '/blog/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/blog/docs/tutorial-basics/create-a-page', 'ef0'),
                exact: true
              },
              {
                path: '/blog/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/blog/docs/tutorial-basics/deploy-your-site', '079'),
                exact: true
              },
              {
                path: '/blog/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/blog/docs/tutorial-basics/markdown-features', 'c3b'),
                exact: true
              },
              {
                path: '/blog/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/blog/docs/tutorial-extras/manage-docs-versions', 'c27'),
                exact: true
              },
              {
                path: '/blog/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/blog/docs/tutorial-extras/translate-your-site', '7d0'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/blog/',
    component: ComponentCreator('/blog/', '980'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
