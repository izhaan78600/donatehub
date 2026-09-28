package com.donatehub.service.impl;

import com.donatehub.dto.admin.AdminDashboardDto;
import com.donatehub.dto.donation.DonationResponse;
import com.donatehub.dto.report.CategoryStatDto;
import com.donatehub.dto.report.DriveStatDto;
import com.donatehub.dto.report.MonthlyTrendDto;
import com.donatehub.dto.report.ReportSummaryDto;
import com.donatehub.entity.DonatedItem;
import com.donatehub.entity.DonationDrive;
import com.donatehub.repository.*;
import com.donatehub.service.ReportService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private final UserRepository userRepository;
    private final DonationDriveRepository donationDriveRepository;
    private final DonatedItemRepository donatedItemRepository;
    private final DistributionRepository distributionRepository;
    private final RecipientRepository recipientRepository;

    public ReportServiceImpl(UserRepository userRepository,
                             DonationDriveRepository donationDriveRepository,
                             DonatedItemRepository donatedItemRepository,
                             DistributionRepository distributionRepository,
                             RecipientRepository recipientRepository) {
        this.userRepository = userRepository;
        this.donationDriveRepository = donationDriveRepository;
        this.donatedItemRepository = donatedItemRepository;
        this.distributionRepository = distributionRepository;
        this.recipientRepository = recipientRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardDto getAdminDashboardData() {
        AdminDashboardDto dto = new AdminDashboardDto();
        dto.setTotalUsers(userRepository.count());
        dto.setTotalDonationDrives(donationDriveRepository.count());
        dto.setActiveDrives(donationDriveRepository.countByStatus("ACTIVE"));
        dto.setCompletedDrives(donationDriveRepository.countByStatus("COMPLETED"));

        long collected = donatedItemRepository.sumTotalQuantity();
        long distributed = distributionRepository.sumTotalDistributedQuantity();
        dto.setTotalItemsCollected(collected);
        dto.setTotalItemsDistributed(distributed);
        dto.setAvailableItems(Math.max(0, collected - distributed));
        dto.setTotalRecipients(recipientRepository.count());

        dto.setDonationsByCategory(getCategoryStats());
        dto.setDonationsByMonth(getMonthlyTrends());

        // Recent activity: top 10 recent donated items
        List<DonatedItem> recentItems = donatedItemRepository.findAll(
                PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();

        List<DonationResponse> recentActivity = recentItems.stream().map(item -> {
            DonationResponse res = new DonationResponse();
            res.setId(item.getId());
            res.setDriveId(item.getDrive().getId());
            res.setDriveName(item.getDrive().getName());
            res.setDonorId(item.getDonor().getId());
            res.setDonorName(item.getDonor().getName());
            res.setDonorEmail(item.getDonor().getEmail());
            res.setCategoryId(item.getCategory().getId());
            res.setCategoryName(item.getCategory().getName());
            res.setItemName(item.getItemName());
            res.setDescription(item.getDescription());
            res.setQuantity(item.getQuantity());
            res.setCondition(item.getCondition());
            res.setCollectionDate(item.getCollectionDate());
            res.setStatus(item.getStatus());

            Integer dist = distributionRepository.sumQuantityByItemId(item.getId());
            if (dist == null) dist = 0;
            res.setDistributedQuantity(dist);
            res.setAvailableQuantity(Math.max(0, item.getQuantity() - dist));
            res.setCreatedAt(item.getCreatedAt());
            res.setUpdatedAt(item.getUpdatedAt());
            return res;
        }).collect(Collectors.toList());

        dto.setRecentActivity(recentActivity);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public ReportSummaryDto getReportSummaryData() {
        ReportSummaryDto dto = new ReportSummaryDto();
        dto.setTotalDonations(donatedItemRepository.count());

        long collected = donatedItemRepository.sumTotalQuantity();
        long distributed = distributionRepository.sumTotalDistributedQuantity();
        dto.setTotalItems(collected);
        dto.setTotalDistributed(distributed);
        dto.setTotalAvailable(Math.max(0, collected - distributed));

        dto.setDonationsByCategory(getCategoryStats());
        dto.setMonthlyTrends(getMonthlyTrends());
        dto.setDrivePerformance(getDrivePerformanceStats());

        return dto;
    }

    private List<CategoryStatDto> getCategoryStats() {
        List<Object[]> rawList = donatedItemRepository.getDonationsByCategory();
        List<CategoryStatDto> list = new ArrayList<>();
        for (Object[] row : rawList) {
            String name = (String) row[0];
            long count = ((Number) row[1]).longValue();
            long qty = ((Number) row[2]).longValue();
            list.add(new CategoryStatDto(name, count, qty));
        }
        return list;
    }

    private List<MonthlyTrendDto> getMonthlyTrends() {
        // Group items and distributions by year-month
        Map<String, long[]> trendMap = new TreeMap<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");

        List<DonatedItem> allItems = donatedItemRepository.findAll();
        for (DonatedItem item : allItems) {
            String ym = item.getCreatedAt().format(fmt);
            trendMap.putIfAbsent(ym, new long[]{0, 0});
            trendMap.get(ym)[0] += item.getQuantity();
        }

        List<com.donatehub.entity.Distribution> allDist = distributionRepository.findAll();
        for (com.donatehub.entity.Distribution d : allDist) {
            String ym = d.getCreatedAt().format(fmt);
            trendMap.putIfAbsent(ym, new long[]{0, 0});
            trendMap.get(ym)[1] += d.getQuantity();
        }

        List<MonthlyTrendDto> result = new ArrayList<>();
        for (Map.Entry<String, long[]> entry : trendMap.entrySet()) {
            result.add(new MonthlyTrendDto(entry.getKey(), entry.getValue()[0], entry.getValue()[1]));
        }

        // If empty, supply current month with zeroes
        if (result.isEmpty()) {
            String current = java.time.YearMonth.now().toString();
            result.add(new MonthlyTrendDto(current, 0, 0));
        }

        return result;
    }

    private List<DriveStatDto> getDrivePerformanceStats() {
        List<DonationDrive> drives = donationDriveRepository.findAll();
        List<DriveStatDto> list = new ArrayList<>();

        for (DonationDrive drive : drives) {
            List<DonatedItem> items = donatedItemRepository.findByDriveId(drive.getId());
            long totalItems = items.stream().mapToLong(DonatedItem::getQuantity).sum();
            long totalDist = 0;
            for (DonatedItem it : items) {
                Integer dist = distributionRepository.sumQuantityByItemId(it.getId());
                if (dist != null) totalDist += dist;
            }
            long totalAvail = Math.max(0, totalItems - totalDist);

            list.add(new DriveStatDto(drive.getId(), drive.getName(), drive.getStatus(), totalItems, totalDist, totalAvail));
        }

        return list;
    }
}
