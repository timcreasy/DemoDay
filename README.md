# My Demo Day

### Mobile
![](http://i.imgur.com/QPwhu02.png)     ![](http://i.imgur.com/fYPrLfn.png)

My Demo Day is an iOS application which aims to help facilitate communication and networking after a Nashville Software School Demo Day.  During Demo Day, a Nashville Software School student can have a [physical web beacon](https://bkon.com/) on their desk, broadcasting their personal website.  Employers attending Demo Day can download the application, and as they navigate the room, different users will appear on their screen when in proximity.  An employer can click on a student's card, and navigate to their personal webpage, as well as favorite a user to be saved to their favorites list.

### Web
![](http://i.imgur.com/HCek8e3.png)

Students will have access to a [web client](https://github.com/timcreasy/DemoDayDashboard), with a unique account tied to their beacon.  Students will be shown a card for each employer who favorited them and will have quick links to email that employer, or search for them on LinkedIn to connect with them.  Notes can be added to help facilitate or document current or future conversations.

### Command Line
![](http://i.imgur.com/nM28hyk.gif =400x326)

My Demo Day was created with reusability in mind.  Along side the mobile and web applications, a [command line application](https://github.com/timcreasy/DemoDayMailer) helps facilitate the bulk emailing of unique registration links, because each student is tied to a unique beacon.  This command line application takes a JSON file as input, listing out a student's full name, email and beacon identifier.  The application also takes a text file template to be used as the body of each individual email.  After these files are completed, the command line prompt can be followed to enter a senders email information to be used to quickly send off unique bulk messages.


### Technologies Used

Nashville Software School was a continual blessing for me education for 6 months, day in, day out.  However, My Demo Day was created and built with several technologies and concepts not taught at Nashville Software School.  Namely, the [BKON SDK](https://bkon.com/), used in this project was written using Objective-C.  The mobile application for My Demo Day was written using React Native, which utilizes JavaScript.  A personal triumph included learning enough Objective-C, and gaining enough understanding of React Native, to bridge over the BKON SDK to be used in JavaScript.  Some concepts learned or used along the way include:
- JavaScript & Node.js
- React
- React Native
- iOS App Store provisioning/signing/deployment
- Objective-C
- Server management

### Attribution
I would personally like to thank the team at [BKON](https://bkon.com/) for their generous help and support throughout this project.  BKON graciouslly provided 25 loaner beacons to be used during Cohort 14's Demo Day at Nashville Software School.  Along with their hardware, I was able to utilizie their companion software, the [BKON SDK](https://bkon.com/sdk) in my project.  
