package org.unibl.etf.efikas.models.dto.itextpdf;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class TableData {
    private String title;
    private List<String> headers;
    private List<List<String>> rows;
    private TableConfig config;
    private Map<String, Object> metadata;
}
