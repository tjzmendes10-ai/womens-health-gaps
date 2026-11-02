---
page: about
title: About
description: Who made this site, how its sources are checked, and how it was built.
---

Tom Mendes is a Sydney-based MBA student at the University of Sydney with eight years in B2B SaaS commercial roles in London. He is currently on [Cicada Innovations](https://www.cicadainnovations.com)' HealthTech Hub Foundations programme at Westmead, working on bringing women's health technology to the Australian market.

## Why I care

I've spent a lot of my life in hospitals. A cycling accident at 14 meant facial reconstruction and years of plastic surgery. Sport added the rest: breaks from running, skiing, football, baseball and cycling, including several skull fractures, one of which left me with a titanium plate.

As I got older, the breaks kept coming, and I started to see the cracks in the system as well as in my bones. In my twenties I had fracture after fracture. After one of them, I spent the night in A&E at King's College Hospital in London waiting for an X-ray. No doctor came all night, and I was sent home. I went back the next day. In total it took more than 36 hours to get a scan. It then took several years to see a rheumatologist and get the bone density (DEXA) scan that finally explained everything: osteoporosis, in my twenties. The doctors were surprised. I was angry.

Reading about osteoporosis led me somewhere I didn't expect: the much bigger gaps in women's health. Women wait years for diagnoses of conditions most people have never heard of, and for decades the research behind their medicine left them out.

I'm the middle child between two sisters, and my mum drove me to appointment after appointment and sat beside me through operation after operation. They've always shown up for me. This site is a small way of showing up for them, and for every woman whose story I've heard since. It's also why I've moved my own work into women's health.

## How sources are checked

Every statistic, date and claim on this site links to a source, and each one was checked against that source rather than written from memory. Where possible, sources are primary: the Australian Institute of Health and Welfare, the Australian Bureau of Statistics, government departments, peer-reviewed journals, and peak clinical and patient bodies.

Australian data comes first. Global figures are used only where Australian data doesn't exist, and are tagged "Global". Where good estimates disagree, the site shows the range and explains why rather than picking the most dramatic number. Where a figure rests on weaker evidence, such as a survey, a single small study, a media release or data more than about five years old, the text says so. Each problem page shows when it was last reviewed.

If you spot an error or a better source, please [open an issue on GitHub](https://github.com/tjzmendes10-ai/womens-health-gaps/issues).

## How this site was built

Tom built this site in one morning without a background in software development, directing Claude Code, an AI coding assistant, from first commit to live deployment.

He set the brief, structure and editorial standards: every statistic must link to a source, weak evidence is labelled as weak, and where studies disagree the site shows the range rather than the most dramatic number. Those rules are built into the site itself. A page with a missing source won't publish.

The site is built with [Astro](https://astro.build/), deploys automatically through GitHub Actions to GitHub Pages, and every change goes through a reviewed pull request. The source code and full change history are [public on GitHub](https://github.com/tjzmendes10-ai/womens-health-gaps).
