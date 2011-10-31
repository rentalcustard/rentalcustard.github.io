---
layout: default
title: Tag navigation with Vim
description: In which we jump around, jump around, jump up and get down
---

If you're using [Vim](http://www.vim.org) for code editing and not using [CTags](http://ctags.sourceforge.net/), you're missing out on some of its most powerful features.

Here are some things I can do with Vim and CTags:

* With my cursor over a method call, jump to the definition of that method
* With my cursor over a class name, jump to the definition of that class
* Jump back to where I was before I jumped to a method/class definition
* Show a list of methods defined in the current file in a buffer on the left.

These features make navigating a large codebase much more pleasant, and make it less worrying to create new classes in your projects. I've heard Rails developers express doubt about creating plain old ruby objects to improve their design because of a worry that files not in app/(models|controllers|views) are less discoverable. So, here's how you set it up. The instructions are OS X-specific but I'm sure users of other OSes can work out what they need to do.

1. Install ctags - `brew install ctags` on OS X
2. In your project, run `ctags -R *` to generate a 'tags' file
3. Open vim, move to a method call or class definition, and hit CTRL-].
4. You are now at the definition of that method call.
5. Hit CTRL-t to jump back where you came.
6. For a list of methods and classes defined in the current file, use the excellent [Taglist.vim](http://www.vim.org/scripts/script.php?script_id=273) plugin. There's a reason it's the most popular plugin on vim.org!

There are many more things you can do with Vim and CTags. For that, see :help tags or [http://vim.wikia.com/wiki/Browsing_programs_with_tags](http://vim.wikia.com/wiki/Browsing_programs_with_tags).
