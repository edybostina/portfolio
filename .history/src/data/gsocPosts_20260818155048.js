// GSoC '26 blog entries.
// Each post gets its own page at #/gsoc/<slug>.
// `summary` is the one-liner shown in the index on the main page.

export const posts = [
    {
        slug: 'community-bonding',
        date: '2026-05-20',
        title: 'Community Bonding & Environment Setup',
        summary: 'Setting up the toolchain, and learning that the validation tooling is the whole job.',
        content: [
            'Started my GSoC journey with the Linux Foundation. I had already sent a few patches during the application period, so the basics were familiar, but these first weeks went on getting the environment right and agreeing the scope with my mentors.',
            'Most of the setup is the validation tooling. A binding conversion is not really "write some YAML", it is "write YAML, then prove it describes every device tree in the tree that uses this device." That means "make dt_binding_check" for the schema and its example, and "make dtbs_check" to run the schema against the actual .dts files. The second one is where the surprises live, because it tells you which boards your new schema has just declared invalid.',
            'The scope we settled on was a set of legacy free-form .txt bindings, mostly Texas Instruments platforms: OMAP, DaVinci, AM335x, and the Palmas and TPS PMIC families that hang off them. About fifty files.',
        ]
    },
    {
        slug: 'omap-counter-32k',
        date: '2026-05-28',
        title: 'OMAP Counter-32K: the first one out the door',
        summary: 'A deliberately small first conversion, chosen because there was very little room to do damage.',
        content: [
            'Submitted the OMAP Counter-32K conversion. It was a good first patch precisely because it is small: a 32 kHz counter with a compatible string, a register range, and a clock. Not much surface area, not much to get wrong.',
            'The value was in the process rather than the patch. Getting git send-email configured properly, working out who actually needs to be on Cc (get_maintainer.pl, and then thinking about the answer rather than trusting it blindly), writing a commit message that explains why rather than what, and then waiting.',
            'Exams are taking most of my time at the moment, but I would rather keep a slow trickle going than disappear for a month and come back cold.'
        ]
    },
    {
        slug: 'ti-iva-bindings',
        date: '2026-06-02',
        title: 'The IVA conversion, and learning what "conversion" means',
        summary: 'The review that taught me a conversion is not an invitation to fix everything you notice.',
        content: [
            'The Texas Instruments IVA bindings — the imaging and video accelerator on OMAP — were where I stopped coasting.',
            'I sent DSP and IVA as a pair. The review came back from Krzysztof Kozlowski and it was blunt in the way that upstream review is blunt when you have missed the point. I had carried over a "ti,iva" compatible that did not need to exist, and I had written the schema so that "ti,ivahd" was, as he put it, both compatible and not compatible at the same time. I had also quietly folded in a handful of unrelated improvements I had noticed along the way.',
            'That last one was the real lesson. His words: this "should not be part of the conversion but separate commit with separate reason and analysis of actual ABI usage. During conversion you only make changes necessary to finish it, not things you in general find."',
            'So in v2 I dutifully split everything out into its own patches — making "ti,hwmods" optional as one patch, documenting the DSP child node as another. And got told to squash them back in: if the conversion leads to known warnings and the original binding is wrong, then the conversion was supposed to make those changes.',
            'Those two pieces of feedback sound contradictory and they are not, which took me an embarrassing amount of staring to see. Changes that are *required* for the conversion to be correct belong inside it. Changes you merely think are improvements belong somewhere else entirely. The line is "does the conversion work without this", not "is this a good idea".',
            'v3 went in with Reviewed-by tags on both. Same technical content as v1, more or less. Organised completely differently.'
        ]
    },
    {
        slug: 'exams-done',
        date: '2026-06-23',
        title: 'Exams Done. Back to the Kernel.',
        summary: 'Exams finished, a few days at the beach, and back to a queue of patches that need cleaning up.',
        content: [
            'Okay, so exams are finally over. I handed in my last one a few days ago and honestly just sat there for a moment staring at the ceiling, that specific kind of quiet when your brain finally stops running on caffeine and anxiety. It\'s a goooood feeling.',
            'To celebrate (and decompress), I spent a few days at the beach with some friends, from the 19th up until yesterday. Exactly what I needed. Sun, salt water, and zero talk of device trees.',
            'Now I\'m fully back. I\'ve been working on a few patches locally that I haven\'t sent out yet. I want to clean them up a bit before pushing them for internal review.',
            'The plan for the coming weeks is to pick up the pace significantly. GSoC\'s midpoint isn\'t that far away and I want to have a solid chunk of conversions done and reviewed by then. No more juggling kernel patches with exam flashcards, just one thing at a time now, and that one thing is this.',
            'More updates soon. The patches won\'t review themselves.'
        ]
    },
    {
        slug: 'midpoint',
        date: '2026-07-06',
        title: 'Midpoint: 25/50 files converted, midterm evaluations begin.',
        summary: 'Halfway, and the review comments start to rhyme.',
        content: [
            '25 out of 50 files converted. Exactly halfway. The pace has been solid and I\'m happy with where things stand.',
            'What has changed since the start is that I can predict most of the review now. Filenames must match the compatible string, so ti,k2g-message-manager.yaml rather than anything descriptive I might have preferred. "unevaluatedProperties: false" or "additionalProperties: false" on every schema, and knowing which of the two applies. Property types must match what already exists rather than what would be tidier — if a property has always been a string, it stays a string, even where an array would be neater.',
            'The subsystem-specific conventions are the ones that catch me. Mark Brown has now told me twice that my subject lines do not look like the rest of the subsystem: "Look at what existing commits in the area you\'re changing are doing and make sure your subject lines visually resemble what they\'re doing." Fair, and easy to fix by reading the git log for the directory before writing the subject rather than after.',
            'Rob Herring\'s CI bot has become the thing I check for first. It runs dt_binding_check on every patch that hits the list and replies with the failures, which for me has meant missing required "clocks" and "clock-names" on the PWM subsystem schema, a phandle that validated under two branches at once in the DA850 pinctrl one, and an incomplete simple-bus setup on the L4 interconnect.',
            'The GSoC midterm evaluations also kicked off today. Neither my mentors nor I have submitted feedback yet, so we\'ll see how that goes over the next few days. Fingers crossed :).'
        ]
    },
    {
        slug: 'bottleneck-moved-upstream',
        date: '2026-07-30',
        title: 'Almost done locally. The bottleneck moved upstream.',
        summary: 'Converting a binding and landing a binding turn out to be two very different timelines.',
        content: [
            'About 10 files left to convert. The conversions themselves have gotten pretty mechanical by now, I know the schema patterns, I know roughly what the driver code is going to tell me, and most files don\'t surprise me anymore.',
            'What I didn\'t fully appreciate at the start is that converting a binding and landing a binding are two completely different timelines. I still have a queue of finished files on my machine waiting to be sent out, and getting them through review is the slow part, not writing them.',
            'The clearest example of that gap was the PWM subsystem conversion. Rob Herring gave it a Reviewed-by, and then took it back: "Withdrawn. Your example is incomplete." I had been testing with DT_SCHEMA_FILES, which only checks the schema you point it at. He pointed me at "make pwm/ti,am33xx-pwmss.yaml" instead, which is a more complete test. My tooling had been telling me everything was fine, which is worse than it telling me nothing.',
            'Some series come back needing rework. A maintainer points out that a property should be optional, or that I dropped a compatible string some old board still depends on, and the patch goes around again as v2, v3, sometimes further. The TPS65217 series is on v4 and has grown from one patch into four, because converting the PMIC binding meant also converting the power button and the backlight that live inside it, and renaming regulator nodes in the .dts to match.',
            'And sometimes it is simply quiet. Maintainers are people with their own queues and their own priorities, so a series can sit for a week or two before anyone gets to it. Not much to do about that except keep sending files and be patient.',
            'So the local work is nearly finished and the upstream work has a while left to run. Still plenty to send.'
        ]
    },
    {
        slug: 'fifty-for-fifty',
        date: '2026-08-17',
        title: 'Fifty for fifty: the conversions are done.',
        summary: 'End of the coding period. All 50 bindings converted, around 30 sent upstream across 19 subsystems.',
        content: [
            'All 50 bindings are converted. That was the scope I proposed back in May, and as of this week every one of them exists as a YAML schema, with the device tree sources they broke fixed alongside them.',
            'The honest status, because the difference matters: converted is not the same as merged. Around 30 of them have been sent upstream so far. Roughly 25 have picked up Reviewed-by tags from maintainers, and a dozen or so have been applied to maintainer trees and are carried in linux-next — the TPS65217 backlight, the OMAP USB TLL, the HDQ one-wire, the TS-4800 watchdog and touchscreen, the OMAP2420 MMC, SmartReflex, the DA8XX MSTPRI bus, the APLL clock, the L4 interconnect. The rest are written and queued for me to send. That will continue past the end of the program.',
            'What surprised me looking back is how far the work spread. It started as "some TI bindings" and ended up touching 19 different subsystems: arm, bus, clock, display, input, leds, mailbox, mfd, mmc, net, pinctrl, power, pwm, regulator, rtc, soc, sound, w1 and watchdog. Each one has its own maintainer, its own conventions, and its own idea of what a good patch looks like. I sent patches to, among others, Rob Herring and Krzysztof Kozlowski on devicetree, Mark Brown for sound and regulators, Dmitry Torokhov for input, Lee Jones for MFD, Alexandre Belloni for RTC, Stephen Boyd for clocks, Linus Walleij for pinctrl, Uwe Kleine-König for PWM, and Ulf Hansson for MMC.',
            'The conversions also turned up real dead weight. The am335x-guardian board had an "isink-en" property that was, as the review confirmed, not documented anywhere and not read by any driver — it had just been sitting in the device tree. Dropping it was its own patch. Rob spotted a similar orphan in the TPS65217 backlight binding. That is the quiet argument for this whole project: the old free-form format let the binding, the device tree and the driver drift apart for years, because nothing was ever checked.',
            'The hardest one was IVA, and not for technical reasons — it took three revisions mostly because I did not understand what belonged inside a conversion and what did not. The longest was TPS65217, which reached v4 and grew from a single patch into a four-patch series once it became clear that converting the PMIC meant converting the power button and backlight inside it too, and renaming regulator nodes in the .dts to match.',
            'Thanks to my mentors — Daniel Baluta, Simona Toaca, Dhruva Gole and Manorit Chawdhry — for the reviews, for catching things before they reached the list, and for pointing me at the right people when I got stuck. And thanks to the maintainers who took the time to explain what I had got wrong rather than just dropping the patch on the floor.',
            'Everything is public: lore.kernel.org/all/?q=egbostina@gmail.com. I am going to keep sending the remaining series until they are all in.'
        ]
    },
    {
        slug: 'what-upstream-taught-me',
        date: '2026-08-18',
        title: 'What upstream actually taught me.',
        summary: 'Six things about kernel development that I did not learn from writing the code.',
        content: [
            'The conversions themselves were the easy part. Almost everything I actually learned this summer came from the part after the code was written, so it seems worth writing down before I forget what it felt like not to know it.',
            'A conversion is a scope, not a licence. My instinct, seeing something wrong next to what I was fixing, was to fix that too. Upstream that reads as noise: the reviewer now has to evaluate two unrelated arguments in one patch. The rule I ended up with is that changes required to make the conversion correct belong inside it, and changes I merely think are improvements belong in their own patch with their own justification. Learning where that line sits took me three revisions of the IVA binding.',
            'Being right is not enough. Several patches of mine were technically accurate and still wrong to send, because they would have broken boards nobody in the conversation owns anymore. The clearest case was not even mine: on the Palmas RTC binding, Alexandre Belloni suggested moving to the generic aux-voltage-chargeable property, and Rob Herring\'s answer was essentially that it would be nicer but this is an existing binding on old hardware, so we are stuck with it. Compatibility is not a slogan, it is a constraint you inherit.',
            'Your tooling can lie to you confidently. I spent weeks testing schemas with DT_SCHEMA_FILES and believing the green output, until a Reviewed-by got withdrawn on the PWM series because my example was incomplete and my test had never been checking that. A test that only checks the thing you told it to check will always agree with you.',
            'Conventions are local. There is no single kernel style. Filenames follow the compatible string; subject lines follow whatever that subsystem\'s git log already does; the choice between additionalProperties and unevaluatedProperties depends on the schema you are extending. None of this is written down in one place, and the fastest way to learn it is to read the last twenty commits in the directory you are about to touch, before writing anything.',
            'Silence is not rejection. A series can sit for two weeks and it means nothing at all. Maintainers have their own queues. The correct response is to wait, ping once politely after a reasonable interval, and keep other work moving in the meantime. It took me a while to stop reading quiet as a verdict.',
            'Small, single-purpose patches move fastest. The ones I split cleanly, with a commit message explaining why rather than what, got reviewed quickly. The ones where I bundled several loosely related things together sat, and then came back asking me to split them. Doing it properly the first time is cheaper than the round trip.',
            'None of this is unique to the kernel, but the kernel teaches it unusually well, because the feedback comes from people who have no reason to be generous and no interest in your feelings about your own patch. I would recommend it to anyone.'
        ]
    }
]

// newest first for display
export const postsByDate = [...posts].sort((a, b) => b.date.localeCompare(a.date))

export const findPost = (slug) => posts.find(p => p.slug === slug)
