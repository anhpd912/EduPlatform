package dev.danh.configs;

import dev.danh.entities.models.Role;
import dev.danh.entities.models.User;
import dev.danh.repositories.auth.PermissionRepository;
import dev.danh.repositories.auth.RoleRepository;
import dev.danh.repositories.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository, PermissionRepository permissionRepository) {
        return args -> {

            //check role admin existed in db
            if (roleRepository.findById("ADMIN").isEmpty()) {
                Role role1 = new Role();
                role1.setName("ADMIN");
                role1.setDescription("ADMIN can manage all user and content in this system.");
                roleRepository.save(role1);
            }
            Role role = roleRepository.findById("ADMIN").orElseThrow();
            //init admin account
            if (userRepository.findByUsername("admin").isEmpty()) {
                User user = new User();
                user.setUsername("admin");
                user.setPassword(passwordEncoder.encode("admin"));
                Set<Role> roles = new HashSet<>();
                roles.add(role);
                user.setRoles(roles);
                user.setIsActive(true);
                userRepository.save(user);
                log.warn(" user has been created with default password: admin, please change password!");
            }
            //check role teacher existed in db
            if (roleRepository.findById("TEACHER").isEmpty()) {
                Role role1 = new Role();
                role1.setName("TEACHER");
                role1.setDescription("TEACHER can teach and manage student.");
                roleRepository.save(role1);
            }
            Role role2 = roleRepository.findById("TEACHER").orElseThrow();
            if (userRepository.findByUsername("teacher").isEmpty()) {
                User user = new User();
                user.setUsername("teacher");
                user.setPassword(passwordEncoder.encode("teacher"));
                Set<Role> roles = new HashSet<>();
                roles.add(role2);
                user.setIsActive(true);
                user.setRoles(roles);
                userRepository.save(user);
                log.warn("Teacher test user has been created with default password: teacher, please change password!");
            }
            //check role student existed in db
            if (roleRepository.findById("STUDENT").isEmpty()) {
                Role role1 = new Role();
                role1.setName("STUDENT");
                role1.setDescription("STUDENT can learn and post comment into lecture.");
                roleRepository.save(role1);
            }
            Role role3 = roleRepository.findById("STUDENT").orElseThrow();
            if (userRepository.findByUsername("student").isEmpty()) {
                User user = new User();
                user.setUsername("student");
                user.setPassword(passwordEncoder.encode("student"));
                Set<Role> roles = new HashSet<>();
                roles.add(role3);
                user.setIsActive(true);
                user.setRoles(roles);
                userRepository.save(user);
                log.warn("Student test user has been created with default password: student, please change password!");
            }
        };
    }
}
