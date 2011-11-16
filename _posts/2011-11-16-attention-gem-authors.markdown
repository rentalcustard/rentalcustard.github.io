---
layout: default
title: Attention gem authors
description: In which we get bitten by a hidden bug and we warn you about it.
---
TL;DR: if your gem has dependencies on other gems, make sure it requires them, because Bundler won't hold your hand any more.

Gem authors: if you're using your gem primarily in [Bundler](http://gembundler.com/)-managed environments and you have runtime dependencies on other gems, you may have a hidden bug which Bundler 1.1 (as it stands) will reveal. Read on to find out how to fix it.

Given a gem depending on capistrano with a single file in its libs, looking something like this:

<script src="https://gist.github.com/1370284.js?file=my_gem_file.rb"> </script>

And a gemspec declaring a dependency on capistrano:

<script src="https://gist.github.com/1370284.js?file=my_gem.gemspec"> </script>

When you call Bundler.require in your app with this gem in the Gemfile, Bundler 1.0 will make sure to require capistrano first. Bundler 1.1, on the other hand, will not. This causes the application using your gem to crash out with 'uninitialized constant Capistrano'. To resolve, you should do what you should have done in the first place, and explicitly require capistrano in your gem's lib files. This has the added advantage of not requiring your users either to use Bundler or explicitly require their dependencies themselves.
