---
layout: default
title: Active Records and Value Objects
description: In which we stop trolling the twitter back-channel and try to say something of worth
---
At last night's [LRUG](http://lrug.org), Matt Wynne and Steve Tooke gave a great talk about trying to apply the concepts of [Hexagonal Architecture](http://alistair.cockburn.us/Hexagonal+architecture) to a typical Rails project. I particularly enjoyed the statement that "all idiomatic Rails controller code is procedural," with which I strongly agree.

Now, this being a technical talk about object-oriented design, and this being me, there were some things in the talk with which I disagreed. Unfortunately, I didn't pay attention to what was coming through in my twitter feed, and so one might get the impression from [my tweets](http://storify.com/mortice/what-happens-when-you-rant-on-twitter-without-cont) that this was my assessment of the majority of the talk. This isn't the case, and I would have liked to get the chance to discuss things in person with Matt and Steve after the talk. This blog post is an attempt to open a discussion on what was really my only objection to the talk, and shouldn't be viewed as a wholesale critique of their position.

With all that out of the way: during the talk, Matt said something along the lines of "I'm thinking about creating Value Object [classes] for each of my ActiveRecords." This is an approach with which I do not agree, even though I can understand the forces which might lead one to take it.

### Value Objects ###

The way I understand the term "value object" is: an immutable object class designed to encapsulate a value with meaning in the domain, to make message-passing between objects with behaviour easier and more idiomatic. Hence, a date is a value object: it is initialized with a value; performing arithmetic on it returns another date instance<sup>1</sup>. The presence of this class in the system makes communicating between two objects that have a common concept of dates easier; instead of saying:

    reporting_system.file_event("Some event data", 20120612)

where the second parameter is an integer the reporting system is supposed to parse and treat as a date, we're able to say:

    reporting_system.file_event("Some event data", Date.new(2012, 6, 12))

This should have obvious benefits.

We often want to create value object classes of our own to simplify message-passing. Hence, we could go one step further in the above example and create an event class:

    class Event
      def initialize(data, date = Date.today)
        @data = data
        @date = date
      end
    end

    reporting_system.file_event(Event.new("Some event data"))

### Active Records ###

The way I understand the active record pattern is: an object class which has mutable state and is backed by a database table, with an interface including a `save` instance method, which will cause a database insert/update depending on context. This object class may also include behavioural methods not related to persistence.

I tend to think that the Active Record pattern is an anti-pattern, namely because one can take two approaches to building systems while using it: either, one can try to avoid violating the Single Responsibility Principle and hence put no methods in active record classes except those to do with persistence, or one can violate the principle and put behavioural concerns into the class.

In the former case, it is very easy to end up with a proliferation of "-er" objects; objects which have as their responsibility mutating the state of other objects, namely (in this case), active records. In the latter case, the interface of the active record classes tends to balloon out of control.

My issue with the active record pattern, and with Rails' ActiveRecord library in particular, has always been that it encourages the creation of stateful object classes representing entities in the system which have genuine behaviours and backing them with persistence, without offering a solution to this design dilemma. For this reason, I prefer alternative approaches which pull persistence out into its own classes. Here, I think Steve, Matt, and I are in agreement.

### Active Records and Value Objects ###

In the majority of Rails codebases I've seen, the active record classes represent some of the core entities in the domain. Hence, financial systems (to use a clich&eacute;d example) have an Account class which is an active record. In reasoning about the design of these systems, I want these to be objects with behaviour and mutable state, albeit state which only the object instances themselves manage and mutate. Hence, to deal with interest payments, I don't want to say:

    account = Account.find(1) #substitute in whatever retrieval mechanism takes your fancy
    AccountManager.new(account).accrue_interest

since this will almost inevitably lead to the AccountManager class, or whatever else I choose to call it, having to mutate the account instance, leading to Tell Don't Ask violations. Steve and Matt seem to be suggesting that we instead pass a value object version of the account, and have the resulting value object be persisted back, presumably along these lines:

    account = Account.find(1)
    vo = Account.find(1).value_object
    result = AccountManager.new(vo).accrue_interest
    account.update_from(vo)

This smells to me. Although we avoid mixing persistence and domain concerns in the Account class, we introduce a new class whose only job is to represent the data of another class, and we have an '-er' object whose job is to operate on that data. But OOP is supposed to be about behaviour, not data. I'd rather implement things more naturally<sup>2</sup>:

    account = Account.find(1)
    account.accrue_interest

Since the `accrue_interest` method's implementation will depend on the account's type and data, it feels to me that it belongs in the account. Persistence is an entirely separate question from this, and it feels wrong to me to be led to take behaviour away from the most natural place in our system because our persistence pattern is problematic.

### Closing thoughts ###

I tend to think that the active record pattern leads good developers onto the horns of a dilemma: either we can violate the single responsibility principle, or we can take behaviour away from the state which affects that behaviour. It is this dilemma which I believe leads Matt and Steve to think about creating value objects for their active records. I think this approach is dangerous, and would rather avoid the dilemma by avoiding the use of the active record pattern. To that end, I have started sketching an alternative approach to persistence in Ruby, jokingly called [Ribernate](https://github.com/mortice/ribernate)<sup>3</sup>. Other people have thought about this too. See for example PlayLouder's [persistence library](https://github.com/playlouder/persistence).

I hope I haven't misrepresented Matt's and Steve's thinking as a strawman here, nor blown a passing remark out of proportion. Matt, Steve, if I have done so, please do let me know and I'll revise the post. I also respect your caveat that this is all stuff that we as a community are trying to find solutions to, and that you're not setting yourselves up as authorities on the matter. I hope this blog post can be read in the same spirit.

1. I'm not sure off the top of my head whether this is the way date objects actually work in Ruby, but I'd argue it should be if it's not.
2. Well, "more naturally" to me, anyway.
3. Please read that code charitably. I dislike a lot of its naming and need to revisit it. It was an afternoon sketch prompted by a rant.
