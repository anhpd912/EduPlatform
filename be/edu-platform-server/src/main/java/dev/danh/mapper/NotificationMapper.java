package dev.danh.mapper;

import dev.danh.entities.dtos.response.notification.NotificationResponse;
import dev.danh.entities.models.Notification;
import dev.danh.enums.NotificationType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(source = "type", target = "type", qualifiedByName = "enumToString")
    NotificationResponse toResponse(Notification notification);

    @Named("enumToString")
    default String enumToString(NotificationType type) {
        return type != null ? type.name() : null;
    }
}
