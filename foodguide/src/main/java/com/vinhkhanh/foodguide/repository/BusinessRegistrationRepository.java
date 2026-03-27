package com.vinhkhanh.foodguide.repository;

import com.vinhkhanh.foodguide.entity.BusinessRegistration;

import com.vinhkhanh.foodguide.entity.Status;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusinessRegistrationRepository extends JpaRepository<BusinessRegistration, Long> {

    List<BusinessRegistration> findByStatus(Status status);

}