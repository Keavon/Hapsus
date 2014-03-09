users = ["this is used to take spot 0, is never used"];



var add_user = function () {
  var is_user_placed = false;
  var user_number = null;

  for (var i=1;i<users.length;i++) { 
    if(users[i] === false) {
      is_user_placed = true;
      user_number = i;
    }
  }

  if (is_user_placed === false) {
    users.push(true);
    user_number = users.length - 1; //Array starts at zero, but user numbers start at one
  }
  return user_number;
};

var get_total_users = function() {
  return users.length - 1;
};

var remove_user = function(number) {
  users[number] = false;
};

exports.add_user = add_user;
exports.get_user = get_total_users;
exports.remove_user = remove_user; 
