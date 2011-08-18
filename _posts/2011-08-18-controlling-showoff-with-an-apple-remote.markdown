---
layout: default
title: Controlling Showoff with an Apple Remote
description: In which we astound ourselves that it's this difficult
---

Fairly recently, I gave a short, stumbling [talk](http://skillsmatter.com/podcast/ajax-ria/matahari) on [matahari](https://github.com/mortice/matahari). As you may notice, I used [Showoff](https://github.com/schacon/showoff) for the slides, and an Apple Remote to advance them. Amazingly enough, I couldn't find any resources on the web for how to do this. So this post documents what I did, in case there's someone else out there who thinks this is important enough to justify the effort and the expense.

There is no native support in OS X for controlling arbitrary applications with the Apple Remote. And with the removal of Front Row, that shiny remote is beginning to feel a bit of a white elephant. Fortunately, there are various applications out there for extending the capabilities of the Remote. The one I ended up using was [Sofa Control](http://www.caseapps.com/sofacontrol), which is a great app for more than just this problem. However, I bought it at an introductory app store price, and I'm not sure I could justify the expense at its current price. Nonetheless, on the off-chance that you either already have it or want to advance those slides with your Remote and damn the expense, let's plough on...

Sofa Control allows us to define custom scripts with Applescript for applications it doesn't support "out of the box". So we just need to add a script for our web browser which (minimally) passes through left and right on the Remote as left and right arrow keystrokes. Here's that applescript:

<script src="https://gist.github.com/1153676.js?file=gistfile1.scpt"> </script>

To use it, open Sofa Control, choose "Script > Installed Scripts" from the menu bar, add a new one with this code, and then check 'automatically controls...' and choose Google Chrome from the drop-down. For another browser, twiddle the correct bits. I'm sure you can work that much out if you're giving a presentation with Showoff!

Now, when Sofa Control is running and you open your browser, 'left' and 'right' on the Remote will pass through as left and right arrow keys, allowing you to advance your slides in Showoff. You could also consider adding other mappings for Showoff hotkeys like 'c' and the vim movement keys on the other remote buttons, but I'll leave that up to you. The code, as all scripts under 100 lines should be, is released under the [WTFPL](http://sam.zoy.org/wtfpl). 
