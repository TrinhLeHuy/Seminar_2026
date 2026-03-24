package com.vinhkhanh.foodguide.repository;

import com.vinhkhanh.foodguide.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByUserUserId(Long userId);
    
    @Query("SELECT l FROM Location l WHERE l.latitude BETWEEN :minLat AND :maxLat " +
           "AND l.longitude BETWEEN :minLng AND :maxLng")
    List<Location> findNearbyLocations(@Param("minLat") Double minLat, 
                                       @Param("maxLat") Double maxLat,
                                       @Param("minLng") Double minLng, 
                                       @Param("maxLng") Double maxLng);
}
