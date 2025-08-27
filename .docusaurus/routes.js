import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/homepage/blog',
    component: ComponentCreator('/homepage/blog', '9c7'),
    exact: true
  },
  {
    path: '/homepage/blog/archive',
    component: ComponentCreator('/homepage/blog/archive', '5d4'),
    exact: true
  },
  {
    path: '/homepage/blog/authors',
    component: ComponentCreator('/homepage/blog/authors', '40b'),
    exact: true
  },
  {
    path: '/homepage/blog/authors/daikon-0313',
    component: ComponentCreator('/homepage/blog/authors/daikon-0313', 'c4c'),
    exact: true
  },
  {
    path: '/homepage/blog/sample-tech-blog',
    component: ComponentCreator('/homepage/blog/sample-tech-blog', '754'),
    exact: true
  },
  {
    path: '/homepage/blog/tags',
    component: ComponentCreator('/homepage/blog/tags', '2cb'),
    exact: true
  },
  {
    path: '/homepage/blog/tags/best-practices',
    component: ComponentCreator('/homepage/blog/tags/best-practices', 'bc8'),
    exact: true
  },
  {
    path: '/homepage/blog/tags/data-engineering',
    component: ComponentCreator('/homepage/blog/tags/data-engineering', '8f0'),
    exact: true
  },
  {
    path: '/homepage/blog/tags/python',
    component: ComponentCreator('/homepage/blog/tags/python', '2b4'),
    exact: true
  },
  {
    path: '/homepage/blog/tags/sql',
    component: ComponentCreator('/homepage/blog/tags/sql', 'fd6'),
    exact: true
  },
  {
    path: '/homepage/markdown-page',
    component: ComponentCreator('/homepage/markdown-page', 'a57'),
    exact: true
  },
  {
    path: '/homepage/docs',
    component: ComponentCreator('/homepage/docs', '4df'),
    routes: [
      {
        path: '/homepage/docs',
        component: ComponentCreator('/homepage/docs', '813'),
        routes: [
          {
            path: '/homepage/docs',
            component: ComponentCreator('/homepage/docs', '584'),
            routes: [
              {
                path: '/homepage/docs/apps/overview',
                component: ComponentCreator('/homepage/docs/apps/overview', '67c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/homepage/docs/bi/overview',
                component: ComponentCreator('/homepage/docs/bi/overview', '2b4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/homepage/docs/domain/overview',
                component: ComponentCreator('/homepage/docs/domain/overview', 'c23'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/homepage/docs/dwh/snowflake/overview',
                component: ComponentCreator('/homepage/docs/dwh/snowflake/overview', 'c53'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/homepage/docs/infrastructure/aws-basics',
                component: ComponentCreator('/homepage/docs/infrastructure/aws-basics', '443'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/homepage/docs/infrastructure/docker-basics',
                component: ComponentCreator('/homepage/docs/infrastructure/docker-basics', 'e80'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/homepage/docs/infrastructure/kubernetes-basics',
                component: ComponentCreator('/homepage/docs/infrastructure/kubernetes-basics', 'e6c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/homepage/docs/intro',
                component: ComponentCreator('/homepage/docs/intro', '16e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/homepage/docs/languages/overview',
                component: ComponentCreator('/homepage/docs/languages/overview', '44c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/homepage/docs/others/overview',
                component: ComponentCreator('/homepage/docs/others/overview', '0f0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/homepage/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/homepage/docs/tutorial-basics/congratulations', '2c6'),
                exact: true
              },
              {
                path: '/homepage/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/homepage/docs/tutorial-basics/create-a-blog-post', '0e9'),
                exact: true
              },
              {
                path: '/homepage/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/homepage/docs/tutorial-basics/create-a-document', 'b4b'),
                exact: true
              },
              {
                path: '/homepage/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/homepage/docs/tutorial-basics/create-a-page', '6b3'),
                exact: true
              },
              {
                path: '/homepage/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/homepage/docs/tutorial-basics/deploy-your-site', 'b9c'),
                exact: true
              },
              {
                path: '/homepage/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/homepage/docs/tutorial-basics/markdown-features', '83d'),
                exact: true
              },
              {
                path: '/homepage/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/homepage/docs/tutorial-extras/manage-docs-versions', 'b78'),
                exact: true
              },
              {
                path: '/homepage/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/homepage/docs/tutorial-extras/translate-your-site', 'c6f'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/homepage/',
    component: ComponentCreator('/homepage/', '9c8'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
