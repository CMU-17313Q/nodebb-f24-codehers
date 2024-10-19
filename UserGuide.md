# User Guide for New Features

## 1. User Guide for Anonymous Posting Feature

## Overview 
The anonymous posting feature allows users to create posts without revealing their identity. This is particularly useful for users who wish to engage in discussions or share content anonymously.

## How to Use the Anonymous Posting Feature

### Navigate to any of the four categories in NodeBB. 

### - Creating a Topic:
Click on the **'New Topic'** button to open a draft. You will see a checkbox labeled **"Post Anonymously"** next to the title input field. Check this box if you want to post anonymously. Fill in the required fields (title, content, etc.) and submit the topic. Your topic will be posted with the username displayed as **"Anonymous."**

### - Creating a Post:
Open any topics that interest you and click **'Reply'** at the top right. This will open a draft for you. Check the box titled **'Post Anonymously'** and submit your reply. Your post will be posted with the username displayed as **"Anonymous."**

> **What is the difference between a Topic and a Post?**
>
> - **Topic:** A topic is a new discussion thread that can contain multiple replies. It usually has a title and is used to introduce a new subject or ask a question.
> 
> - **Post:** A post is a bit different in the sense that a post can be a topic but a topic can't a post....meaning it can be a response to a topic but also the topic itself! you don't have to worry about it too much just know that it adds to the discussion initiated by the topic and can include replies from various users. Posts are often used to provide feedback, share opinions, or ask for clarifications on the topic.

## User Testing
### Here’s how you, the user, can manually test this awesome feature:

- **Test Anonymous Topic Creation:** 
  - Navigate to any category, open a draft, select "Post Anonymously," and create a topic. Verify that the topic appears with the name "Anonymous."

- **Test Non-Anonymous Topic Creation:** 
  - Create another topic without checking the "Post Anonymously" option. Verify that your username is displayed as the topic creator.

- **Test Anonymous Replies:** 
  - Open an existing topic and reply using the "Post Anonymously" option. Ensure the reply is posted anonymously.

- **Test Default (Non-Anonymous) Replies:** 
  - Reply to a topic without checking the "Post Anonymously" option. Verify that your username appears next to the post.

## Automated Testing

Below are the files that contain automated tests for the anonymous posting feature, along with explanations for each.

### test/api.js:
Edited to handle the inclusion of the **isAnonymous** field. This file tests the schema and database alignments for anonymous posting.

### test/posts.js:
Added test cases for creating posts anonymously. This includes tests to ensure that posts default to non-anonymous when the checkbox is not selected.

### test/topics.js:
Added test cases for creating topics anonymously. These tests ensure that the **isAnonymous** field behaves as expected and that topics are displayed as anonymous when the option is selected.

## Why These Tests Are Sufficient

Now onto why I, the developer, believe these tests are comprehensive. The tests cover both anonymous and non-anonymous creation of posts and topics. This ensures:

- The anonymous option is correctly applied when selected.
- The default behavior (non-anonymous posting) works as expected when the checkbox is not selected.


- Schema and database fields related to anonymity are properly aligned.
- These automated tests ensure the feature is implemented as expected and functions correctly under various conditions, reducing the risk of issues after deployment.


## 2. User Guide for Resources Page Feature

## Overview 
The resources page feature allows users to be able to create posts with attached links and have those links easily accessible in one place, within the nodeBB server. This is particularly useful for users to efficiently locate important resources in one location.

## How to Use the Resources Page Feature
1. Navigate to any one of the four categories (Announcements, General Discussion, Comments and Feedback, Blogs)
   - Upon navigating to one of the categories' pages, you will see the **"Resources" button** (with a link symbol) - this button will navigate you to the Resources page later on.
2. Click on the **'New Topic'** button (or click on any of the topics already created and click on the **'Reply'** or **'Quick Reply'** button) to create a draft.
3. In the text box of the draft simply enter a link, or click on the “link” symbol to insert the link along with the link text (how the link will appear in the post), and submit the draft.
4. Return to the landing page of the category that contains all the topics (by clicking on the category link: Home -> *category link* )
5. Click the **"Resources button** to be taken to the Resources Page, which contains an alphabetically sorted list of all the links from the topics.
   - If no links appear on the page upon landing, simply refresh the page.

## User Testing
### Here’s how you, the user, can manually test this awesome feature:

Upon navigating to any category, open a draft:

- **Basic Functionality Test - Test with a link (Topic):** 
  - Enter **a link** in the topic text box and submit. Navigate to the "Resources" page by clicking the "Resources" button, and verify that the **link** appears on the page. 

- **Post with Multiple Links:** 
  - Enter **multiple link** in the topic text box and submit. Navigate to the "Resources" page by clicking the "Resources" button, and verify that the **links** appears on the page. 

- **Test with Invalid Links:** 
  - Enter **an invalid link** in the topic text box and submit. Navigate to the "Resources" page by clicking the "Resources" button, and verify that the link **does not appear** on the page. 

- **Basic Functionality Test - Test with a link (Reply):** 
  - Open an existing topic and click **Reply** or **Quick Reply**. Enter **a link** in the text box and submit. Navigate to the "Resources" page by clicking the "Resources" button, and verify that the **link** appears on the page. 

## Automated Testing

Below are the files that contain automated tests for the resources page feature, along with explanations for each.

### test/link-extraction.js: 
**What is being tested:** This file tests the "extractLinks" function which identifies and extracts links from the user's posts to be displayed on the resources page. The test file tests extracting multiple links from a post, extracting links in a Markdown format, as well as removing duplicate links from the post.

**Why the tests are sufficient:** The tests cover the main use cases for the extractLinks function, the tests handle various edge cases for the link-extraction, asserts are used to comapre the extracted links with the expected results, and console logging assists in displaying the functionality.

### test/resources-button.js:

**What is being tested:** This file tests the functionality of the "resources" button by simulating user interactions. The test file tests the visibility of the resources button, as well handling the click of the reosurces button by simulating a click event and ensuring the resources page is displayed and with the links.

**Why the tests are sufficient:** The tests cover the main functionalities including the visibility and behavior of the button when it's clicked, the click event mimics the user interactions, the visibility and click-handling assertions ensure the functionality, as well as the logs help in debugging. 

### test/resources-page.js:
**What is being tested:** This file tests the rendering of the "resources" page after the resources button is clicked, by simulating the controller's behavior. The tests cases include simulating a request to the resources button controller and ensuring the rendering of the page with the extracted links, as well as simulating the handling of an error.

**Why the tests are sufficient:** The tests cover the successful rendering of the resources page with the controller and error handling. The test simulate how the controller works properly render the resources page when the button is clicked, the assertions validate the render of the content with the expected result, as well as console logging to debug.

### test/api-resources-button.js:

**What is being tested:** The test suit demonstrates the rendering of the resources page from the api/resources-button enpoint by simulating HTTP GET requests and verifying the responses. The test file tests the successful return response from the API, the return of the expected outcome in the response through assertions, and the handling of invalid requests.

**Why the tests are sufficient:** The tests cover the main functionalities of the api endpoint, the tests use a mock function to simulate the API endpoint requests, assertions are used to validate outcomes using status codes assertions, and logging is used for debugging.
