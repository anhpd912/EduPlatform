package dev.danh.enums;

public enum AuthProvider {

    LOCAL("local"),
    GOOGLE("google"),
    FACEBOOK("facebook"),
    GITHUB("github");

    private final String provider;

    AuthProvider(String provider) {
        this.provider = provider;
    }

    public String getProvider() {
        return provider;
    }

    @Override
    public String toString() {
        return provider;
    }
}
