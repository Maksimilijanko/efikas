package org.unibl.etf.efikas.design_patterns.strategy.impl;

import org.unibl.etf.efikas.design_patterns.strategy.interfaces.BookLayoutStrategy;
import org.unibl.etf.efikas.models.dto.books.DomesticGuestsBookDTO;
import org.unibl.etf.efikas.models.dto.itextpdf.TableConfig;

import java.util.ArrayList;
import java.util.List;

public class DomesticGuestsBookLayoutStrategy implements BookLayoutStrategy<DomesticGuestsBookDTO> {
    @Override
    public String generateTitle() {
        return "КЊИГА ДОМАЋИХ ГОСТИЈУ";
    }

    @Override
    public List<String> generateHeaders() {
        return List.of(
                "Ред. бр. пријаве",
                "Име и презиме",
                "Пол",
                "Дан, мјесец и година рођења",
                "Мјесто, општина и држава рођења",
                "Адреса",
                "Јединствени матични број грађана",
                "Број и спрат смјештајне јединице",
                "Датум и вријеме доласка",
                "Датум и вријеме одласка",
                "Број издатог фискалног рачуна",
                "Примједба"
        );
    }

    @Override
    public TableConfig generateTableConfig() {
        return TableConfig.builder()
                .columnWidths(new float[]{
                        40, // "Ред. бр. пријаве",
                        40, // "Име и презиме",
                        40, // "Пол",
                        40, // "Дан, мјесец и година рођења",
                        40, // "Мјесто, општина и држава рођења",
                        40, // "Адреса",
                        40, // "Јединствени матични број грађана",
                        40, // "Број и спрат смјештајне јединице",
                        40, // "Датум и вријеме доласка",
                        40, // "Датум и вријеме одласка",
                        40, // "Број издатог фискалног рачуна",
                        40, // "Примједба"
                })
                .hasTitleRow(true)
                .hasTotalRow(false)
                .build();
    }

    @Override
    public List<List<String>> getTableData(DomesticGuestsBookDTO request) {
        List<List<String>> rows = new ArrayList<>();



        return rows;
    }
}
