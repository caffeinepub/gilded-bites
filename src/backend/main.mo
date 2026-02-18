import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import OutCall "http-outcalls/outcall";
import Iter "mo:core/Iter";
import Bool "mo:core/Bool";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Photo = {
    url : Text;
    width : Int;
    height : Int;
  };

  type Restaurant = {
    id : Nat;
    name : Text;
    category : Text;
    starRating : Float;
    priceRange : Text;
    distance : Float;
    mainPhoto : ?Photo;
    subPhotos : [Photo];
  };

  public type UserProfile = {
    name : Text;
  };

  let restaurants = List.empty<Restaurant>();

  let userFavorites = Map.empty<Principal, List.List<Restaurant>>();

  let userProfiles = Map.empty<Principal, UserProfile>();

  func mockRestaurants() : List.List<Restaurant> {
    restaurants.clear();
    restaurants.add({
      id = 1;
      name = "Sunny Side Cafe";
      category = "Cafe";
      starRating = 4.5;
      priceRange = "$$";
      distance = 1.2;
      mainPhoto = ?{
        url = "url1.jpg";
        width = 800;
        height = 600;
      };
      subPhotos = [
        { url = "url2.jpg"; width = 400; height = 300 },
        { url = "url3.jpg"; width = 400; height = 300 },
        { url = "url4.jpg"; width = 400; height = 300 },
        { url = "url5.jpg"; width = 400; height = 300 },
      ];
    });

    restaurants.add({
      id = 2;
      name = "Grill House";
      category = "Steakhouse";
      starRating = 4.7;
      priceRange = "$$$";
      distance = 2.5;
      mainPhoto = ?{
        url = "url6.jpg";
        width = 800;
        height = 600;
      };
      subPhotos = [
        { url = "url7.jpg"; width = 400; height = 300 },
        { url = "url8.jpg"; width = 400; height = 300 },
        { url = "url9.jpg"; width = 400; height = 300 },
        { url = "url10.jpg"; width = 400; height = 300 },
      ];
    });

    restaurants.add({
      id = 3;
      name = "Pasta Place";
      category = "Italian";
      starRating = 4.3;
      priceRange = "$$";
      distance = 0.9;
      mainPhoto = ?{
        url = "url11.jpg";
        width = 800;
        height = 600;
      };
      subPhotos = [
        { url = "url12.jpg"; width = 400; height = 300 },
        { url = "url13.jpg"; width = 400; height = 300 },
        { url = "url14.jpg"; width = 400; height = 300 },
        { url = "url15.jpg"; width = 400; height = 300 },
      ];
    });

    restaurants;
  };

  func determineRestaurantDataSource(isTest : Bool) : List.List<Restaurant> {
    if (isTest) {
      mockRestaurants();
    } else {
      List.empty<Restaurant>();
    };
  };

  func addToUserFavorites(principal : Principal, restaurant : Restaurant) {
    let favoriteList = switch (userFavorites.get(principal)) {
      case (null) {
        let newList = List.empty<Restaurant>();
        userFavorites.add(principal, newList);
        newList;
      };
      case (?list) { list };
    };
    favoriteList.add(restaurant);
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // HTTP Outcall Transform
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Restaurant browsing - accessible to all users including guests
  public query ({ caller }) func getRestaurants(isTest : Bool) : async [Restaurant] {
    let restaurants = determineRestaurantDataSource(isTest);
    restaurants.toArray();
  };

  // Swipe right - requires authenticated user
  public shared ({ caller }) func swipeRight(restaurantId : Nat, isTest : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save favorites");
    };
    let restaurants = determineRestaurantDataSource(isTest);
    switch (restaurants.find(func(r) { r.id == restaurantId })) {
      case (?restaurant) {
        addToUserFavorites(caller, restaurant);
      };
      case (null) { () };
    };
  };

  // Save favorite restaurant from external API
  public shared ({ caller }) func saveFavoriteRestaurantFromApi(restaurant : Restaurant) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save favorites");
    };
    addToUserFavorites(caller, restaurant);
  };

  // Get favorites - requires authenticated user
  public query ({ caller }) func getFavorites() : async [Restaurant] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access favorites");
    };
    switch (userFavorites.get(caller)) {
      case (?favoritesList) { favoritesList.toArray() };
      case (null) { [] };
    };
  };

  // Clear favorites - requires authenticated user
  public shared ({ caller }) func clearFavorites() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear favorites");
    };
    userFavorites.remove(caller);
  };

  // Update star rating - admin only (modifies global data)
  public shared ({ caller }) func updateStarRating(restaurantId : Nat, rating : Float, isTest : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update ratings");
    };
    restaurants.clear();
    let updatedRestaurants = List.empty<Restaurant>();
    let currentRestaurants = determineRestaurantDataSource(isTest);
    for (restaurant in currentRestaurants.values()) {
      if (restaurant.id == restaurantId) {
        updatedRestaurants.add({ restaurant with starRating = rating });
      } else {
        updatedRestaurants.add(restaurant);
      };
    };
    restaurants.addAll(updatedRestaurants.values());
  };
};
