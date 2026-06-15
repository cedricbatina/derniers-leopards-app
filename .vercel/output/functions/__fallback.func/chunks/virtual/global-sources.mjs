const sources = [
    {
        "context": {
            "name": "nuxt:pages",
            "description": "Generated from your static page files.",
            "tips": [
                "Can be disabled with `{ excludeAppSources: ['nuxt:pages'] }`."
            ]
        },
        "urls": [
            {
                "loc": "/",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/"
                    }
                ]
            },
            {
                "loc": "/en",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/"
                    }
                ]
            },
            {
                "loc": "/pt",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/"
                    }
                ]
            },
            {
                "loc": "/login",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/login"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/login"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/login"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/login"
                    }
                ]
            },
            {
                "loc": "/en/login",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/login"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/login"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/login"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/login"
                    }
                ]
            },
            {
                "loc": "/pt/login",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/login"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/login"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/login"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/login"
                    }
                ]
            },
            {
                "loc": "/scenes",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/scenes"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/scenes"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/scenes"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/scenes"
                    }
                ]
            },
            {
                "loc": "/en/scenes",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/scenes"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/scenes"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/scenes"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/scenes"
                    }
                ]
            },
            {
                "loc": "/pt/scenes",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/scenes"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/scenes"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/scenes"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/scenes"
                    }
                ]
            },
            {
                "loc": "/explore/about",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/about"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/about"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/about"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/about"
                    }
                ]
            },
            {
                "loc": "/en/explore/about",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/about"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/about"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/about"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/about"
                    }
                ]
            },
            {
                "loc": "/pt/explore/about",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/about"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/about"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/about"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/about"
                    }
                ]
            },
            {
                "loc": "/explore",
                "lastmod": "2026-02-11T12:42:50.332Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore"
                    }
                ]
            },
            {
                "loc": "/en/explore",
                "lastmod": "2026-02-11T12:42:50.332Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore"
                    }
                ]
            },
            {
                "loc": "/pt/explore",
                "lastmod": "2026-02-11T12:42:50.332Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore"
                    }
                ]
            },
            {
                "loc": "/studios",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/studios"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/studios"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/studios"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/studios"
                    }
                ]
            },
            {
                "loc": "/en/studios",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/studios"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/studios"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/studios"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/studios"
                    }
                ]
            },
            {
                "loc": "/pt/studios",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/studios"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/studios"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/studios"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/studios"
                    }
                ]
            },
            {
                "loc": "/explore/access",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/access"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/access"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/access"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/access"
                    }
                ]
            },
            {
                "loc": "/en/explore/access",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/access"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/access"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/access"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/access"
                    }
                ]
            },
            {
                "loc": "/pt/explore/access",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/access"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/access"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/access"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/access"
                    }
                ]
            },
            {
                "loc": "/explore/scenes",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/scenes"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/scenes"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/scenes"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/scenes"
                    }
                ]
            },
            {
                "loc": "/en/explore/scenes",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/scenes"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/scenes"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/scenes"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/scenes"
                    }
                ]
            },
            {
                "loc": "/pt/explore/scenes",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/scenes"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/scenes"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/scenes"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/scenes"
                    }
                ]
            },
            {
                "loc": "/glossary",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/glossary"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/glossary"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/glossary"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/glossary"
                    }
                ]
            },
            {
                "loc": "/en/glossary",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/glossary"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/glossary"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/glossary"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/glossary"
                    }
                ]
            },
            {
                "loc": "/pt/glossary",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/glossary"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/glossary"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/glossary"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/glossary"
                    }
                ]
            },
            {
                "loc": "/register",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/register"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/register"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/register"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/register"
                    }
                ]
            },
            {
                "loc": "/en/register",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/register"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/register"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/register"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/register"
                    }
                ]
            },
            {
                "loc": "/pt/register",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/register"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/register"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/register"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/register"
                    }
                ]
            },
            {
                "loc": "/timeline",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/timeline"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/timeline"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/timeline"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/timeline"
                    }
                ]
            },
            {
                "loc": "/en/timeline",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/timeline"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/timeline"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/timeline"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/timeline"
                    }
                ]
            },
            {
                "loc": "/pt/timeline",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/timeline"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/timeline"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/timeline"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/timeline"
                    }
                ]
            },
            {
                "loc": "/explore/pricing",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/pricing"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/pricing"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/pricing"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/pricing"
                    }
                ]
            },
            {
                "loc": "/en/explore/pricing",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/pricing"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/pricing"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/pricing"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/pricing"
                    }
                ]
            },
            {
                "loc": "/pt/explore/pricing",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/pricing"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/pricing"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/pricing"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/pricing"
                    }
                ]
            },
            {
                "loc": "/workspace",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/workspace"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/workspace"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/workspace"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/workspace"
                    }
                ]
            },
            {
                "loc": "/en/workspace",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/workspace"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/workspace"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/workspace"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/workspace"
                    }
                ]
            },
            {
                "loc": "/pt/workspace",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/workspace"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/workspace"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/workspace"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/workspace"
                    }
                ]
            },
            {
                "loc": "/characters",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/characters"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/characters"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/characters"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/characters"
                    }
                ]
            },
            {
                "loc": "/en/characters",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/characters"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/characters"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/characters"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/characters"
                    }
                ]
            },
            {
                "loc": "/pt/characters",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/characters"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/characters"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/characters"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/characters"
                    }
                ]
            },
            {
                "loc": "/explore/features",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/features"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/features"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/features"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/features"
                    }
                ]
            },
            {
                "loc": "/en/explore/features",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/features"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/features"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/features"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/features"
                    }
                ]
            },
            {
                "loc": "/pt/explore/features",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/features"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/features"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/features"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/features"
                    }
                ]
            },
            {
                "loc": "/explore/glossary",
                "lastmod": "2026-02-11T12:42:59.174Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/glossary"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/glossary"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/glossary"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/glossary"
                    }
                ]
            },
            {
                "loc": "/en/explore/glossary",
                "lastmod": "2026-02-11T12:42:59.174Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/glossary"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/glossary"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/glossary"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/glossary"
                    }
                ]
            },
            {
                "loc": "/pt/explore/glossary",
                "lastmod": "2026-02-11T12:42:59.174Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/glossary"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/glossary"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/glossary"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/glossary"
                    }
                ]
            },
            {
                "loc": "/explore/timeline",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/timeline"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/timeline"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/timeline"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/timeline"
                    }
                ]
            },
            {
                "loc": "/en/explore/timeline",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/timeline"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/timeline"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/timeline"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/timeline"
                    }
                ]
            },
            {
                "loc": "/pt/explore/timeline",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/timeline"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/timeline"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/timeline"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/timeline"
                    }
                ]
            },
            {
                "loc": "/explore/workflow",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/workflow"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/workflow"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/workflow"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/workflow"
                    }
                ]
            },
            {
                "loc": "/en/explore/workflow",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/workflow"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/workflow"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/workflow"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/workflow"
                    }
                ]
            },
            {
                "loc": "/pt/explore/workflow",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/workflow"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/workflow"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/workflow"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/workflow"
                    }
                ]
            },
            {
                "loc": "/register/success",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/register/success"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/register/success"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/register/success"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/register/success"
                    }
                ]
            },
            {
                "loc": "/en/register/success",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/register/success"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/register/success"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/register/success"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/register/success"
                    }
                ]
            },
            {
                "loc": "/pt/register/success",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/register/success"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/register/success"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/register/success"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/register/success"
                    }
                ]
            },
            {
                "loc": "/explore/characters",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/characters"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/characters"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/characters"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/characters"
                    }
                ]
            },
            {
                "loc": "/en/explore/characters",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/characters"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/characters"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/characters"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/characters"
                    }
                ]
            },
            {
                "loc": "/pt/explore/characters",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/characters"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/characters"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/characters"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/characters"
                    }
                ]
            },
            {
                "loc": "/verify-email",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/verify-email"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/verify-email"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/verify-email"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/verify-email"
                    }
                ]
            },
            {
                "loc": "/en/verify-email",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/verify-email"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/verify-email"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/verify-email"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/verify-email"
                    }
                ]
            },
            {
                "loc": "/pt/verify-email",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/verify-email"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/verify-email"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/verify-email"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/verify-email"
                    }
                ]
            },
            {
                "loc": "/explore/structuring",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/structuring"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/structuring"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/structuring"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/structuring"
                    }
                ]
            },
            {
                "loc": "/en/explore/structuring",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/structuring"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/structuring"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/structuring"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/structuring"
                    }
                ]
            },
            {
                "loc": "/pt/explore/structuring",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/structuring"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/structuring"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/structuring"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/structuring"
                    }
                ]
            },
            {
                "loc": "/explore/studio",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/studio"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/studio"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/studio"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/studio"
                    }
                ]
            },
            {
                "loc": "/en/explore/studio",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/studio"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/studio"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/studio"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/studio"
                    }
                ]
            },
            {
                "loc": "/pt/explore/studio",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/studio"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/studio"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/studio"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/studio"
                    }
                ]
            },
            {
                "loc": "/verify-email/success",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/verify-email/success"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/verify-email/success"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/verify-email/success"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/verify-email/success"
                    }
                ]
            },
            {
                "loc": "/en/verify-email/success",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/verify-email/success"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/verify-email/success"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/verify-email/success"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/verify-email/success"
                    }
                ]
            },
            {
                "loc": "/pt/verify-email/success",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/verify-email/success"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/verify-email/success"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/verify-email/success"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/verify-email/success"
                    }
                ]
            },
            {
                "loc": "/explore/editors",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/editors"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/editors"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/editors"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/editors"
                    }
                ]
            },
            {
                "loc": "/en/explore/editors",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/editors"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/editors"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/editors"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/editors"
                    }
                ]
            },
            {
                "loc": "/pt/explore/editors",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/editors"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/editors"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/editors"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/editors"
                    }
                ]
            },
            {
                "loc": "/explore/writing",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/writing"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/writing"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/writing"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/writing"
                    }
                ]
            },
            {
                "loc": "/en/explore/writing",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/writing"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/writing"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/writing"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/writing"
                    }
                ]
            },
            {
                "loc": "/pt/explore/writing",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/writing"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/writing"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/writing"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/writing"
                    }
                ]
            },
            {
                "loc": "/forgot-password",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/forgot-password"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/forgot-password"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/forgot-password"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/forgot-password"
                    }
                ]
            },
            {
                "loc": "/en/forgot-password",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/forgot-password"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/forgot-password"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/forgot-password"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/forgot-password"
                    }
                ]
            },
            {
                "loc": "/pt/forgot-password",
                "lastmod": "2026-02-11T12:42:12.786Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/forgot-password"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/forgot-password"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/forgot-password"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/forgot-password"
                    }
                ]
            },
            {
                "loc": "/studio/projects",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/studio/projects"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/studio/projects"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/studio/projects"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/studio/projects"
                    }
                ]
            },
            {
                "loc": "/en/studio/projects",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/studio/projects"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/studio/projects"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/studio/projects"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/studio/projects"
                    }
                ]
            },
            {
                "loc": "/pt/studio/projects",
                "lastmod": "2026-02-11T12:42:12.787Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/studio/projects"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/studio/projects"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/studio/projects"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/studio/projects"
                    }
                ]
            },
            {
                "loc": "/explore/creators",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "fr-FR",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/creators"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/creators"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/creators"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/creators"
                    }
                ]
            },
            {
                "loc": "/en/explore/creators",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/creators"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/creators"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/creators"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/creators"
                    }
                ]
            },
            {
                "loc": "/pt/explore/creators",
                "lastmod": "2026-02-11T12:42:12.785Z",
                "_sitemap": "pt-PT",
                "alternatives": [
                    {
                        "hreflang": "fr-FR",
                        "href": "/explore/creators"
                    },
                    {
                        "hreflang": "en-US",
                        "href": "/en/explore/creators"
                    },
                    {
                        "hreflang": "pt-PT",
                        "href": "/pt/explore/creators"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/explore/creators"
                    }
                ]
            }
        ],
        "sourceType": "app"
    }
];

export { sources };
//# sourceMappingURL=global-sources.mjs.map
