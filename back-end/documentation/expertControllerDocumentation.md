# Documentation

## Method: addTopic
The method adds a certain topic for a specific expert.
@param : expertId
@param : topicId
@param : username
@return : JSON contains the expert with the newly added topic
@author : Youssef Tarek

## Method: updateExpert
The method updates experts' fields.
@param : expertId
@param : username
@param : columns for experts to be overwritten
@return : JSON contains the expert with his/her attributes
@author : Youssef Tarek

## Method: deleteExpert
The method deletes a certain expert.
@param : expertId
@return : JSON contains the deleted expert
@author : Youssef Tarek

## Method: getExperts
The method access Expert table and get all records found.
@param : none
@return : Json file of all Experts
@author : Engy Fawaz

## Method: getExpertsByUsername
The method access Expert table and get Experts found by username entered by a user as an input.
@param : Expert Username (String)
@return : Json file of Experts found
@author : Engy Fawaz

## Method: getExpert
The method access Expert table and get Expert found.
@param : Expert Id (in Experts table in database)
@return : Json file of Expert found
@author : Engy Fawaz

## Method: createExpert
The method create a new expert and add it to table Experts in database.  
@param : user name (String)
@param : rating (number)
@return : Json file of new Expert
@author : Engy Fawaz

## Method: filterByOverview
Its aim is to do full/partial search in the experts by a keyword in the expertOverview.
@params overview
@Return  JSON response of filtered experts, an error otherwise.
@author Ahmed Amr

## Method: filterByTopicTitle
@params title
Its aim is to do full/partial search in the experts by the first letters in a keyword in the topic title.
@Return  JSON response of filtered experts, an error otherwise.
@author Ahmed Amr

## Method: filterByOverviewAndTitle
@params overview, title
Its aim is to do full/partial search in the experts by a keyword in the expertOverview and
full/partial search in the experts by the first letters in a keyword in the topic title.
@Return  JSON response of filtered experts, an error otherwise.
@author Ahmed Amr

## Method: filterByTopicTitleAndRatingHighToLow
@params title
Its aim is to do full/partial search in the experts by the first letters in a keyword in the topic title,
and descendingly according to their ratings.
@Return  JSON response of filtered experts, an error otherwise.
@author Ahmed Amr

## Method: filterByTopicTitleAndRatingLowToHigh
@params title
Its aim is to do full/partial search in the experts by the first letters in a keyword in the topic title,
and ascendingly according to their ratings.
@Return  JSON response of filtered experts, an error otherwise.
@author Ahmed Amr

## Method: filterByOverviewAndRatingHighToLow
@params overview
Its aim is to do full/partial search in the experts by a keyword in the expertOverview,
and descendingly according to their ratings.
@Return  JSON response of filtered experts, an error otherwise.
@author Ahmed Amr

## Method: filterByOverviewAndRatingLowToHigh
@params overview
Its aim is to do full/partial search in the experts by a keyword in the expertOverview,
and ascendingly according to their ratings.
@Return  JSON response of filtered experts, an error otherwise.
@author Ahmed Amr

## Method: filterByOverviewAndTitleAndratingHighToLow
@params none
Its aim is to do full/partial search in the experts by a keyword in the expertOverview and
full/partial search in the experts by the first letters in a keyword in the topic title.
and descendingly according to their ratings.
@Return  JSON response of filtered experts, an error otherwise.
@author Ahmed Amr

## Method: filterByOverviewAndTitleAndRatingLowToHigh
@params none
Its aim is to do full/partial search in the experts by a keyword in the expertOverview and
full/partial search in the experts by the first letters in a keyword in the topic title.
and ascendingly according to their ratings.
@Return  JSON response of filtered experts, an error otherwise.
@author Ahmed Amr

## Method: sortExpertsUsernameAtoZ
Its aim is to get all the experts ascendingly according to their usernames.
@params none
@Return  JSON response of experts, an error otherwise.
@author Hanien Ahmed

## Method: sortExpertsUsernameZtoA
@params none
Its aim is to get all the experts descendingly according to their usernames.
@Return  JSON response of experts, an error otherwise.
@author Hanien Ahmed

## Method: sortExpertsRatingHighestToLowest
@params none
Its aim is to get all the experts descendingly according to their ratings.
@Return  JSON response of experts, an error otherwise.
@author Hanien Ahmed


## Method: sortExpertsRatingLowestToHighest
@params none
Its aim is to get all the experts ascendingly according to their ratings.
@Return  JSON response  of experts, an error otherwise.
@author Hanien Ahmed


## Method: createTopic
@params topicTitle, topicDescription
Its aim is to create a Topic in the list of topics inside the database
@Return JSON respons saying that it was created successfully , an error otherwise.

## Method:filterByOverview
@params overview  
Its aim is to do full/partial search in the experts by a keyword in the expertOverview.  
@Return  JSON response of filtered experts, an error otherwise.  
@author Ahmed Amr

## Method:filterByTopicTitle
@params title  
Its aim is to do full/partial search in the experts by the first letters in a keyword in the topic title.  
@Return  JSON response of filtered experts, an error otherwise.  
@author Ahmed Amr


## Method:filterByOverviewAndTitle
@params overview, title  
Its aim is to do full/partial search in the experts by a keyword in the expertOverview and  
full/partial search in the experts by the first letters in a keyword in the topic title.  
@Return  JSON response of filtered experts, an error otherwise.  
@author Ahmed Amr


## Method:filterByTopicTitleAndRatingHighToLow
@params title  
Its aim is to do full/partial search in the experts by the first letters in a keyword in the topic title,  
and descendingly according to their ratings.  
@Return  JSON response of filtered experts, an error otherwise.  
@author Ahmed Amr

## Method:filterByTopicTitleAndRatingLowToHigh
@params title  
Its aim is to do full/partial search in the experts by the first letters in a keyword in the topic title,  
and ascendingly according to their ratings.  
@Return  JSON response of filtered experts, an error otherwise.  
@author Ahmed Amr

## Method:filterByOverviewAndRatingHighToLow
@params overview  
Its aim is to do full/partial search in the experts by a keyword in the expertOverview,  
and descendingly according to their ratings.  
@Return  JSON response of filtered experts, an error otherwise.  
@author Ahmed Amr


## Method:filterByOverviewAndRatingLowToHigh
@params overview  
Its aim is to do full/partial search in the experts by a keyword in the expertOverview,  
and ascendingly according to their ratings.  
@Return  JSON response of filtered experts, an error otherwise.  
@author Ahmed Amr


## Method:filterByOverviewAndTitleAndratingHighToLow
@params none  
Its aim is to do full/partial search in the experts by a keyword in the expertOverview and  
full/partial search in the experts by the first letters in a keyword in the topic title.  
and descendingly according to their ratings.  
@Return  JSON response of filtered experts, an error otherwise.  
@author Ahmed Amr


## Method:filterByOverviewAndTitleAndRatingLowToHigh
@params none  
Its aim is to do full/partial search in the experts by a keyword in the expertOverview and  
full/partial search in the experts by the first letters in a keyword in the topic title.  
and ascendingly according to their ratings.  
@Return  JSON response of filtered experts, an error otherwise.  
@author Ahmed Amr


## Method:sortExpertsUsernameAtoZ
@params none  
Its aim is to get all the experts ascendingly according to their usernames.  
@Return  JSON response of experts, an error otherwise.  
@author Hanien Ahmed


## Method:sortExpertsUsernameZtoA
@params none  
Its aim is to get all the experts descendingly according to their usernames.  
@Return  JSON response of experts, an error otherwise.  
@author Hanien Ahmed


## Method:sortExpertsRatingHighestToLowest
@params none  
Its aim is to get all the experts descendingly according to their ratings.  
@Return  JSON response of experts, an error otherwise.  
@author Hanien Ahmed


## Method:sortExpertsRatingLowestToHighest
@params none  
Its aim is to get all the experts ascendingly according to their ratings.  
@Return  JSON response  of experts, an error otherwise.  
@author Hanien Ahmed



## Method:createTopic
@params topicTitle, topicDescription  
Its aim is to create a Topic in the list of topics inside the database  
@Return JSON respons saying that it was created successfully , an error otherwise.  
@author Hanien Ahmed
