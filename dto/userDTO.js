class UserDto {
    constructor(user) {
        this.id_user = user.id_user;
        this.first_name = user.first_name;
        this.second_name = user.second_name;
        this.last_name = user.last_name;
        this.second_last_name = user.second_last_name;
        this.email = user.email;
    }

    static map(users) {
        return users.map(user => new UserDto(user));
    }
}

module.exports = UserDto;
