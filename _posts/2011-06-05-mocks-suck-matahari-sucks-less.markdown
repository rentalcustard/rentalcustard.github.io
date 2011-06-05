---
layout: default
title: Mocks suck. Matahari sucks less
description: In which we hunt a white whale and manage to hurt it a little bit
---

Mocks suck. Their preconceptions don't conform to the reality of most codebases, and using them in your test suite will make your tests brittle, frustrating, and less readable.

###Mocks and Arrange-Act-Assert
Long before the BDDers came along and told us that tests were composed of Given, When and Then steps, the pattern 'Arrange, Act, Assert' was well-established for creating readable tests. That is, tests were laid out like this:

<script src="https://gist.github.com/1009053.js?file=arrange_act_assert.rb"> </script> 

In RSpec and other libraries supporting contexts, we might end up writing the test like this to avoid duplication down the line:

<script src="https://gist.github.com/1009053.js?file=rspec_arrange_act_assert.rb"> </script>

We would do similar things with setup methods in xUnit-style testing libraries.

Mocks make us specify message expectations in advance. This means we end up shuffling our Assert/Then step, which is in the form of a message expectation, back up the test before the Act/When step:

<script src="https://gist.github.com/1009053.js?file=mocks_arrange_assert_act.rb"> </script>

It doesn't take long for this to get even more jarring - let's throw in some stubbing (a separate task from expecting messages, as Martin Fowler [describes](http://martinfowler.com/articles/mocksArentStubs.html)) and some standard assertions:

<script src="https://gist.github.com/1009053.js?file=mocks_make_your_brain_hurt.rb"> </script>

The mixture of mocking and stubbing in most mocking frameworks to a one-liner means it's not at all clear whether message expectations belong in before/setup blocks or in assertion blocks. Putting them in shared setup blocks cuts down on duplication at the cost of readability, and the opposite is true for putting them closer to normal assertions.

###Mocks and refactoring
Part of the value of unit testing is to provide a safety net when refactoring. Generally speaking, a safe refactoring improves the design of the code without changing its purpose. So in most cases, tests should not break significantly as a result of refactoring. However, owing to the way that mocks are designed in the majority of cases, this is not the case in test suites which make extensive use of them.

By default, mocks force us to have an expectation set up for each call made to a collaborating object which is replaced by a mock. Consider the following code under test:

<script src="https://gist.github.com/1009053.js?file=simple_code_using_collaborator.rb"> </script>

This can easily be tested with mocks and a single message expectation. But now what happens when we find we need to check whether the warehouse is empty? We need to at least stub the "empty?" call, just to make our existing tests pass. But this is a query method and whether or not it is called is not what interests us about the test. Certainly, we want (under the new spec) to make sure that our object doesn't send items to the warehouse when it is full, but how it finds out whether the warehouse is full is irrelevant to its correct behaviour. By throwing a 'mock received unexpected message "empty?"' error at us, mock objects make us focus on the wrong thing.

###Spies - an alternative test double strategy
All of the above explains why I think mocks are a problem, but I don't oppose the use of test doubles of some form. Certainly, it's important to be able to isolate our unit tests to the class under test, and we do sometimes want to test that a specific method was called on a collaborator with specific arguments. But mock objects are not the only solution to this problem.

Instead, we can use test spies, which collect information about what methods were called on them and can later be asked to verify that certain calls were or were not made. There are libraries in the Ruby world which provide test spies, namely [RR](https://github.com/btakita/rr) and [Not a Mock](http://notahat.com/not_a_mock). They both provide facilities to assert on method calls after the fact, with syntax something like this (RR):

<script src="https://gist.github.com/1009053.js?file=rr_test_spies.rb"> </script>

But the problem with this approach is on line 2. Without that line, the invocation will fail with a NoMethodError and the object doesn't do any collecting of the method call so that it can be asserted on later. There's no need for this in a pure test spy library. The misleadingly-named Mockito for Java has no need for method stubs to exist to allow message verification after the fact:

<script src="https://gist.github.com/1009053.js?file=mockito_example.java"> </script>

The problem for RR is that it sets out to support multiple test double strategies, including fail-fast mocks, and so it only supports spying via real objects which don't implement method_missing to allow for unexpected calls.

###Matahari

All of the above led me to write [Matahari](https://github.com/mortice/matahari), which only implements test spies and hence has none of the problems detailed above (although it has many others!). With matahari, you can write this:

<script src="https://gist.github.com/1009053.js?file=matahari_example.rb"> </script>

It also implements argument matching, verifying the number of times a method was called and simple stubbing. For more examples, the [README](https://github.com/mortice/matahari/blob/master/README.rdoc) and [Cucumber tests](http://relishapp.com/mortice/matahari) are the places to go. For caveats, see the README.

Future plans include:

* Making it less hostile to people not using RSpec
* Supporting more complex stubbing
* Supporting argument matchers

However, it is usable now and I'm finding it more fun than testing collaborations with mock objects.
