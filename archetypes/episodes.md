---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
season: 1
episode: 1
author: "Staff"
image: "/images/episodes/{{ .Name }}.jpg"
description: "{{ replace .Name "-" " " | title }} - Episode description"
---