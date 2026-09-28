package com.donatehub.service.impl;

import com.donatehub.dto.common.PageResponse;
import com.donatehub.dto.donor.DonorResponse;
import com.donatehub.entity.Donor;
import com.donatehub.exception.ResourceNotFoundException;
import com.donatehub.repository.DonatedItemRepository;
import com.donatehub.repository.DonorRepository;
import com.donatehub.service.DonorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DonorServiceImpl implements DonorService {

    private final DonorRepository donorRepository;
    private final DonatedItemRepository donatedItemRepository;

    public DonorServiceImpl(DonorRepository donorRepository, DonatedItemRepository donatedItemRepository) {
        this.donorRepository = donorRepository;
        this.donatedItemRepository = donatedItemRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<DonorResponse> searchDonors(String query, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Donor> donors = donorRepository.searchDonors(query, pageRequest);
        Page<DonorResponse> dtoPage = donors.map(this::mapToResponse);
        return new PageResponse<>(dtoPage);
    }

    @Override
    @Transactional(readOnly = true)
    public DonorResponse getDonorById(Long id) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: " + id));
        return mapToResponse(donor);
    }

    private DonorResponse mapToResponse(Donor donor) {
        DonorResponse res = new DonorResponse();
        res.setId(donor.getId());
        res.setUserId(donor.getUser() != null ? donor.getUser().getId() : null);
        res.setName(donor.getName());
        res.setEmail(donor.getEmail());
        res.setPhone(donor.getPhone());
        res.setAddress(donor.getAddress());
        res.setTotalDonations(donatedItemRepository.findByDonorIdOrderByCreatedAtDesc(donor.getId()).size());
        res.setTotalQuantity(donatedItemRepository.sumTotalQuantityByDonorId(donor.getId()));
        res.setCreatedAt(donor.getCreatedAt());
        return res;
    }
}
