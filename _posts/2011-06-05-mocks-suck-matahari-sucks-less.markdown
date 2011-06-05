---
layout: default
title: Mocks suck. Matahari sucks less
description: In which we hunt a white whale and manage to hurt it a little bit
---

Mocks suck. Their preconceptions don't conform to the reality of most codebases, and using them in your test suite will make your tests brittle, frustrating, and less readable.

##Traditional test layout
Long before the BDDers came along and told us that tests were composed of Given, When and Then steps, the pattern 'Arrange, Act, Assert' was well-established for creating readable tests. That is, tests were laid out like this:

  <script src="https://gist.github.com/1009053.js?file=arrange_act_assert.rb" />
