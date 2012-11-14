---
layout: default
title: Three Competing Forces
description: In which we take a look at mock objects in their context
---
I want to talk about mocks in terms of their historical context, and the forces which led to their development. While we should strive not to be bound by the past, often considering tools in terms of the problems they were designed to solve is a useful guide to their effective usage, or at the least to an understanding of their deficiencies. By presenting three principles from the schools of object-oriented design and test-driven development, we can observe a conflict in their applications. Mock objects, and the style of testing they represent, provide us with a way to resolve this conflict, or at least to obviate it.

## Principle 1: Tell, Don't Ask

Very closely related to the Single Responsibility Principle[^1], this is the principle that an object should normally avoid making decisions about what to do based on the state of another object. Here, as ever, I am heavily indebted to Steve Freeman and Nat Pryce[^2], and I see no better way of illustrating this principle than to quote from them, translating from Java to Ruby:

> When we don't follow the style, we can end up with what's known as "train wreck" code, where a series of getters is chained together like the carriages in a train. Here's one case we found on the Internet:
    master.modelisable.dockable_panel.customizer.save_item.enabled = true
> After some head scratching, we realized what this fragment was meant to say:
    master.allow_saving_of_customizations
> This wraps all that implementation detail up behind a single call. The client of `master` no longer needs to know anything about the types in the chain. We've reduced the risk that a design change might cause ripples in remote parts of the codebase.
> As well as hiding information, there's a more subtle benefit from "Tell, Don't Ask." It forces us to make explicit and so name the interactions between objects, rather than leaving them implicit in the chain of getters. The shorter version above is much clearer about what it's for, not just how it happens to be implemented.

Astute readers will note that this principle is also known as the Law of Demeter[^3]. Indeed, Freeman and Pryce identify the two (p. 17). The style of design that they advocate, however, actually goes further than Demeter; for the most part, they do not ask questions of objects on which they call command methods. Hence (p. 18), "[w]e try to be sparing with queries on objects (as opposed to values) because they can allow information to "leak" out of the object, making the system a little bit more rigid." I would therefore like to extend the wording of TDA, if not the intent, somewhat, to say that we should avoid defining and calling query methods on objects for which we define and call command methods.

## Principle 2: Test in Isolation

The standard definition of a unit test[^4] is, roughly, a test which exercises a single compilation unit (in an OO system, a class) in isolation, such that a failure in the unit test indicates a bug in either the test, the compilation unit, or the environment in which the test is running, and not in any other compilation unit.

To achieve this aim, we use stubs which stand in for any dependencies of the unit under test, implementing an identical interface and presenting the minimum acceptable behaviour of these dependencies. These stubs are kept minimal to avoid their needing to be tested themselves.

Testing in isolation, assuming a context in which there are higher-level tests to verify that compilation units are correctly configured and integrated such that the system as a whole performs as expected, confers multiple benefits, among them:

* Fast feedback loops when working on individual compilation units; we need only run the slower tests when our (fast, isolated) test is passing
* The ability, when a test is failing, to determine efficiently the compilation unit into which the corresponding bug has been introduced
* Feedback about the dependencies of our object, through the amount of effort required to set up stub objects in their place. Both the presence of complicated stubs and the presence of a large number of stubs in the setup for an isolated test are smells that we have design problems pertaining to the unit under test.

## Principle 3: State-based assertion

Observe that the simplest form of a unit test runs something like this[^5]:

    def assert_adding_a_positive_integer_results_in_a_positive
      num = Number.new("2")
      num.add(2)
      assert_equals(4, num.to_i)
    end

Here, we arrange our unit under test so that it is ready for us to exercise the behaviour with which we are interested (line 2), act upon it (line 3), and finally make an assertion based on the unit's state[^6].

I hesitate to call this a 'principle'. It would be more correct to say it is a fact of testing frameworks which shapes our thinking, and that it is a force which we will see conflicts with the prior two principles.

## A conflict

Observe that the rigorous application of these three principles leads us into conflict. If we test by verifying state and also want to test in isolation, we need our subject under test to expose its state somehow, leading us to violate TDA by calling a query method on an object on which we have defined command methods. Further, in this case, the behaviour of our object may well be simply that it, having made some decisions of its own, calls on another object in a certain way. Unless it proceeds to ask a question of that other object and alter its state accordingly, we cannot verify this behaviour by inspecting the state of the unit under test. Hence, testing by verifying state pushes us away from the principle of TDA.

We can continue to test based on state while conforming to TDA by rejecting the idea of testing in isolation; that is, instead of injecting stubs for each of the subject under test's dependencies, we simply construct instances of its actual collaborators and verify the behaviour of the system at some endpoint, i.e. its user-facing output or what it writes to a database driver. This is all well and good if we are happy to lose the benefits listed above for testing in isolation, and additionally if we are happy to accept the risk that, in testing with concrete instances of collaborating objects, we fix in our minds the idea that *this* type of object interacts with precisely *this* type of object (a precursor to violations of the Dependency Inversion Principle[^7].)

So perhaps we might decide to reject the idea of testing by verifying state. We might decide, instead, to verify that, given some preconditions and a method call with certain parameters, our unit under test calls on one of its collaborators in such-and-such a way. So, instead of a stub, we introduce to the object a test double which will give us the ability to pass or fail the test based on the messages which it is sent. With this facility, we preserve the ability to test units in isolation when the behaviour of those units is defined in terms of their interaction with other objects in certain conditions and not primarily in terms of their state. This is precisely the facility that mock objects give us.

## Conclusion

Mock objects arise from the situation in which we want to architect our code as a network of objects sending messages to one another (Tell, Don't Ask), while testing the compilation units which define those objects in isolation from one another (Test in Isolation), while our tools enable testing only based on the state of the system or a part of it at any given time (state-based assertion). By extending the behaviour of stubs, an existing concept from the world of testing, to include verification of the messages received, mock objects enable a style of testing which allows us to move away from state-based assertion and toward specifying the behaviour of an object in terms of its interactions with others.

[^1]: [http://www.objectmentor.com/resources/articles/srp.pdf](http://www.objectmentor.com/resources/articles/srp.pdf)
[^2]: [http://growing-object-oriented-software.com](http://growing-object-oriented-software.com)
[^3]: [http://www.ccs.neu.edu/home/lieber/LoD.html](http://www.ccs.neu.edu/home/lieber/LoD.html)
[^4]: [http://c2.com/cgi/wiki?StandardDefinitionOfUnitTest](http://c2.com/cgi/wiki?StandardDefinitionOfUnitTest). I appreciate the naivety of assuming standard definitions for anything in the world of software development, but I beg the reader's indulgence.
[^5]: While I normally use RSpec in testing examples, in this case I use the more traditional Test::Unit framework, since we are concerned here with historical context.
[^6]: I apologize, as ever, for the contrived nature of this code example. Since a Number is a value, it should not be mutable, and hence the example breaks down under scrutiny. I am attempting to focus on the nature of the *test* rather than that of the (imagined) code it is testing.
[^7]: [http://www.objectmentor.com/resources/articles/dip.pdf](http://www.objectmentor.com/resources/articles/dip.pdf)
