---
layout: default
title: RSpec, Ctags and vim, oh my!
---

I recently switched to [Vim](http://www.vim.org/) for all my text-editing, including Rails development. This made me feel quite a bit more awesome.

Except.

I'm working on a codebase with a number of fairly large classes and specs, and they're a pain to navigate. The [Taglist](http://vim-taglist.sourceforge.net/) plugin makes navigation around classes quite a bit easier, but when editing a spec I was faced with this:

![No tags!](/images/no_tags.png)

No taglist! I'm buggered if I'm scrolling through this whole file for the right place to put my next test. Now, I *could* refactor the spec into smaller pieces so I wouldn't have this problem. Arguably, I should. But the lack of tags would offend against my keenly-developed sense of aesthetics.

So instead, I did this.

![With tags!](/images/with_tags.png)

How do you get your hands on this hotness?

Grab my ctags fork from [here](http://github.com/mortice/exuberant-ctags). Compile and install in the usual way. Then grab and install my taglist fork from [here](http://github.com/mortice/taglist.vim). Run ctags in the normal way and you'll get your rspec files tagged and bagged.

Now, this is far from perfect. In fact, it's pig-ugly and hardly works. What can I say? I've never written any C before, and I didn't particularly enjoy it on this outing. But hopefully there's enough here for someone with some more skill to get hacking on it so that eventually we can get these changes merged into the mainline of Ctags. Here's a list of things that need to be fixed:

* Tags include the 'do' noise from the end of the line
* It'll probably break on various characters which aren't in the whitelist in [ruby.c:192](http://github.com/mortice/exuberant-ctags/blob/master/ruby.c#L192)
* Tags aren't hierarchical

**New** Discussion for this post [here](http://www.reddit.com/r/vim/comments/dtqwz/alpha_ctagstaglist_support_for_rspec_files_in_vim/)
