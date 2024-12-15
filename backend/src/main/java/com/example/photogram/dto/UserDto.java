package com.example.photogram.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {

    @NotBlank(message = "ID를 입력하세요.")
    private String username;

    @NotBlank(message = "비밀번호를 입력하세요.")
    @Size(min = 8, message = "비밀번호는 8글자 이상이어야 합니다.")
    private String password;

    // 추가된 메서드
    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
