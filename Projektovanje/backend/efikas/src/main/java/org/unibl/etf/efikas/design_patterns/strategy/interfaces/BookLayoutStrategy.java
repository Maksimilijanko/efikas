package org.unibl.etf.efikas.design_patterns.strategy.interfaces;

import org.unibl.etf.efikas.models.dto.itextpdf.TableConfig;

import java.util.List;

public interface BookLayoutStrategy<T> {
    String generateTitle();
    List<String> generateHeaders();
    TableConfig generateTableConfig();
    List<List<String>> getTableData(T request);
}
