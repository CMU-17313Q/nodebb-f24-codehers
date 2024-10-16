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
- These automated tests ensure the feature is robust and functions correctly under various conditions, reducing the risk of issues after deployment.
