let UserService = {
  getUserId: function () {
    const userToken = localStorage.getItem("user_token");
    const decodedToken = jwt_decode(userToken);
    const userID = decodedToken.user.user_ID;

    return userID;
  },

  getUserOrders: function () {
    const user_ID = UserService.getUserId();

    RestClient.get('')
  },
};
