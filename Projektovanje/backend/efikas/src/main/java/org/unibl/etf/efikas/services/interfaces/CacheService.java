package org.unibl.etf.efikas.services.interfaces;

public interface CacheService {
    void store(String key, String value);
    String get(String key);
    void remove(String key);
}
