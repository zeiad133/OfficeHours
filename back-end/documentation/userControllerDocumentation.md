## Documentation Section
## Method requestExpert :
@params decodedToken user_.id
@params expert_id
@params questionContent
@params questionSubject

this method allows user to request for any expert by sending him/her a question and this is done by creating a question and put the expert he/she requested in the array of experts of the question created.The method do this after checking that the user id is a valid object id and that the user exists as well as checking the expert id that it is a valid object id and that the expert exists.

@return json file of question created
@author Merna Ghabour


## Method updateUsername :
@params decodedToken user._id
@params username

this method allows the user to change his/her username at any time and check the user's id and make sure that it is a valid object id and that the user exists.

@Return Json file of updated User
@author Merna Ghabour
